import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Njabulo OS",
  description: "Personal operating system (Monday x Notion x Monarch)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
