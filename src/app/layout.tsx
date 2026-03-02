import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import SessionProvider from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "MangaMind — AI Story Creator",
  description: "Create manga and webtoon stories with AI. Generate plot, characters, and dialogue instantly.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-[#0c0b1a] text-gray-100 antialiased">
        <SessionProvider>
          <Navbar />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
