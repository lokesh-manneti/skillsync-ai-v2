'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Map,
    MessageSquare,
    FileText,
    LogOut,
    BrainCircuit,
    Settings
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

const navItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: Map, label: "Roadmap", href: "/roadmap" }, // We will build this next
    { icon: MessageSquare, label: "AI Mentor", href: "/chat" },
    { icon: FileText, label: "Resume Builder", href: "/resume" },
];

export function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuthStore();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white hidden lg:flex lg:flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center px-6 border-b border-slate-100">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                        <BrainCircuit size={20} />
                    </div>
                    <span className="font-heading text-lg font-bold text-slate-900">SkillSync</span>
                </Link>
            </div>

            {/* Nav Links */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                                isActive
                                    ? "bg-brand-50 text-brand-700 shadow-sm"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <item.icon size={18} className={isActive ? "text-brand-600" : "text-slate-400"} />
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            {/* Footer Actions */}
            <div className="border-t border-slate-100 p-4 space-y-1">

                {/* FIX: Link to /settings */}
                <Link
                    href="/settings"
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                >
                    <Settings size={18} className="text-slate-400" />
                    Settings
                </Link>

                <button
                    onClick={() => logout()}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                    <LogOut size={18} />
                    Sign out
                </button>
            </div>
        </aside>
    );
}