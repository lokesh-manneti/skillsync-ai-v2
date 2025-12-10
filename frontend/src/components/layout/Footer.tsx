import Link from "next/link";
import { BrainCircuit } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <BrainCircuit className="text-slate-400" size={24} />
            <span className="text-sm font-semibold text-slate-900">SkillSync AI</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} SkillSync AI. Built for engineers, by engineers.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-slate-500 hover:text-brand-600">Privacy</Link>
            <Link href="#" className="text-sm text-slate-500 hover:text-brand-600">Terms</Link>
            <Link href="#" className="text-sm text-slate-500 hover:text-brand-600">Twitter</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}