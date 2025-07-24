import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SWRConfig } from 'swr';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "🌊 On-Chain Fund-Flow Heatmap",
  description: "Visualize weekly money movement between major crypto assets and wallet cohorts (exchanges, whales, miners, smart contracts) in a single glance.",
  keywords: "crypto, blockchain, on-chain, fund flow, heatmap, bitcoin, ethereum, defi",
  authors: [{ name: "Prashant Radhakrishnan" }],
  openGraph: {
    title: "🌊 On-Chain Fund-Flow Heatmap",
    description: "Visualize weekly money movement between major crypto assets and wallet cohorts",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "🌊 On-Chain Fund-Flow Heatmap",
    description: "Visualize weekly money movement between major crypto assets and wallet cohorts",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <SWRConfig
          value={{
            revalidateOnFocus: false,
            refreshInterval: 30 * 60 * 1000, // 30 minutes
            errorRetryCount: 3,
            errorRetryInterval: 5000,
          }}
        >
          {children}
        </SWRConfig>
      </body>
    </html>
  );
}
