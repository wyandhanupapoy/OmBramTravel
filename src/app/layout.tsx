import { ReactNode } from "react";
import { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  verification: {
    google: "uM3l19nlPDO4zX2XXqJFP_Xg4Q0ZFlEULjRr15K0YlI",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body className="bg-paper text-ink min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
