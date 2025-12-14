'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, MessageSquare, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Home", href: "/dashboard" },
  { icon: Map, label: "Roadmap", href: "/roadmap" },
  { icon: MessageSquare, label: "Mentor", href: "/chat" },
  { icon: FileText, label: "Resume", href: "/resume" },
  { icon: User, label: "Settings", href: "/settings" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 lg:hidden pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1",
                isActive ? "text-brand-600" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}