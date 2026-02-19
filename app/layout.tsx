import "./globals.css";
import { BackgroundFX } from "@/components/BackgroundFX";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-white">
        <BackgroundFX />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
