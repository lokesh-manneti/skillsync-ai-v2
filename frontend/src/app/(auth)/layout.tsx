'use client';

import Link from "next/link";
import { BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
      
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-200/30 blur-[100px] animate-blob" />
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-accent-200/30 blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-[100px] animate-blob animation-delay-4000" />
      </div>

      {/* Logo Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 mb-8"
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 text-white shadow-lg shadow-brand-500/30">
            <BrainCircuit size={24} strokeWidth={2.5} />
          </div>
          <span className="font-heading text-2xl font-bold tracking-tight text-slate-900">
            SkillSync AI
          </span>
        </Link>
      </motion.div>

      {/* Main Card Container */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {children}
      </motion.div>

      {/* Footer Text */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 mt-8 text-center text-sm text-slate-500"
      >
        Secure access powered by Gemini 2.5 Flash
      </motion.p>
    </div>
  );
}