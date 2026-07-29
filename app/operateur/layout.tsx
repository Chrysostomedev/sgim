"use client";

import Sidebar, { SidebarProvider } from "@/components/layouts/sidebar";
import Navbar from "@/components/layouts/navbar";
import { ToastProvider } from "@/contexts/ToastContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-[#F8FAFC]">
          <Sidebar />

          <div className="md:pl-64 transition-all duration-300">
            <Navbar />
            <main className="pt-20 px-4 md:px-6 pb-8">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ToastProvider>
  );
}