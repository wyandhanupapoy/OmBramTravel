import "@/styles/globals.css";
import { ReactNode } from "react";

export default function DriverLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-paper text-ink min-h-screen">
      {children}
    </div>
  );
}
