import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jeevadhara — AI-Operated Farmer Marketplace",
  description:
    "Real farmers, real buyers, real AI decisions. Built with Gemini for the Build with Gemini XPRIZE, Small Business Services category.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-body">{children}</body>
    </html>
  );
}
