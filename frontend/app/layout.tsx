import type { Metadata, Viewport } from "next";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import "@fontsource/ibm-plex-mono/400.css";
import "./globals.css";
import { Shell } from "@/components/shell";

export const metadata: Metadata = {
  title: { default: "FleetPulse AI", template: "%s · FleetPulse AI" },
  description:
    "Fleet operations intelligence: weighted route KPIs, Big Data engine comparison, validated XGBoost revenue models, and exact PKR fuel/ops budget allocation across fleet channels.",
  icons: { icon: "/icon.svg" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

// Light-first theme: apply stored preference before paint.
const themeScript = `try{var t=localStorage.getItem("fleetpulse.theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;else document.documentElement.dataset.theme="light"}catch(e){document.documentElement.dataset.theme="light"}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#main" className="sr-only">
          Skip to content
        </a>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
