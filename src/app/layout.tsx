import { ReactNode } from "react";
import "@/styles/globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body className="bg-paper text-ink min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
