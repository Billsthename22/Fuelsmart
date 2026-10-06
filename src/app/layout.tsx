import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FuelSmart — Find fuel near you",
  description: "Compare verified fuel-station prices, availability, and directions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
