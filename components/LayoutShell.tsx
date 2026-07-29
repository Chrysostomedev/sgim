"use client";

import Navbar from "@/components/layouts/navbar";

export default function LayoutWithNavbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pt-20 px-6 pb-10">
        {children}
      </main>
    </div>
  );
}
