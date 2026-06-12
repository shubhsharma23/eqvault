import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EQVault — EQ Presets for Every Earphone",
  description:
    "Discover, copy, and share equalizer presets for every TWS earphone. Make your buds sound like anything.",
  keywords: ["EQ presets", "equalizer", "TWS", "earphones", "audiophile", "sound tuning"],
  openGraph: {
    title: "EQVault",
    description: "Make your buds sound like anything.",
    siteName: "EQVault",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg-primary text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
