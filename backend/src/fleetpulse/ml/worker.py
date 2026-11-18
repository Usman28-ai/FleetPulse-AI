import argparse
import time
from pathlib import Path

import pandas as pd
import psutil

from fleetpulse.data.repository import Repository
from fleetpulse.domain import DomainError
from fleetpulse.hosting.workspace import serverless
from fleetpulse.ml.contracts import TrainingConfig
from fleetpulse.ml.service import prepare, sha256
from fleetpulse.ml.store import ModelStore, now
from fleetpulse.ml.train import Stopped, train


def run(data_root, job_id):
    repo, store = Repository(data_root), ModelStore(data_root)
    job = store.get(job_id)
    folder = store.root / job_id
    started = time.monotonic()

    def check():
        if store.get(job_id)["cancel_requested"]:
            raise Stopped()
        if time.monotonic() - started > (180 if serverless() else 600):
            raise DomainError("Training exceeded the execution limit. Use a smaller report.")
        if psutil.Process().memory_info().rss > 2 * 1024**3:
            raise DomainError("Training exceeded its 2 GiB worker memory ceiling.")

    def stage(name, message):
        check()
        store.update(job_id, status="running", stage=name, message=message)

    try:
        stage("preparing", "Checking the immutable input snapshot and chronological split.")
        if sha256(folder / "input.parquet") != job["input_sha256"]:
            raise DomainError("Training snapshot checksum failed. Start a new run.")
        config = TrainingConfig.model_validate(job["config"])
        manifest, _, parts, coverage = prepare(
            repo, config, input_frame=pd.read_parquet(folder / "input.parquet")
        )
        result = train(parts, coverage, manifest, config, folder, check, stage)
        check()
        parts[2].to_parquet(folder / "holdout.parquet", index=False)
        result["hashes"]["holdout.parquet"] = sha256(folder / "holdout.parquet")
        with repo.connect() as conn:
            conn.execute("BEGIN IMMEDIATE")
            repo.get(manifest.id)
            # Cancellation and publication share a registry transaction.
            final = store.complete(job_id, result)
            if final["status"] == "cancelled":
                store.cleanup_partial(job_id)
    except Stopped:
        store.update(
            job_id,
            status="cancelled",
            stage="cancelled",
            completed_at=now(),
            message="Training cancelled. No model was published.",
        )
    except Exception as error:
        print(f"{type(error).__name__}: {error}", flush=True)
        store.update(
            job_id,
            status="failed",
            stage="failed",
            completed_at=now(),
            message=error.message
            if isinstance(error, DomainError)
            else "Training failed. Review local worker.log and retry; no model was published.",
        )
    finally:
        (folder / "input.parquet").unlink(missing_ok=True)
        try:
            store.cleanup_partial(job_id)
        except DomainError:
            pass  # Source deletion already removed this completed model and its files.


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-root", type=Path, required=True)
    parser.add_argument("--job", required=True)
    args = parser.parse_args()
    run(args.data_root, args.job)
