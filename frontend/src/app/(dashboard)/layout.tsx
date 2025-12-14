'use client';

import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav"; // <--- Import this
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      <main className="lg:pl-64 min-h-screen transition-all duration-300 pb-20 lg:pb-0">
        <div className="container mx-auto p-4 md:p-8 max-w-7xl">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  );
}