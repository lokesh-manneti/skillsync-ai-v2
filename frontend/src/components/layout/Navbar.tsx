'use client';

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-accent-600 text-white">
            <BrainCircuit size={20} strokeWidth={2.5} />
          </div>
          <span className="font-heading text-lg font-bold tracking-tight text-slate-900">
            SkillSync AI
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {['Features', 'How it Works', 'Pricing'].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900">
            Sign in
          </Link>
          <Link href="/signup">
            <Button size="sm" className="shadow-lg shadow-brand-500/20">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}