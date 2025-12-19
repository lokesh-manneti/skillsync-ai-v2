'use client';

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-brand-200/40 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 right-[10%] w-72 h-72 bg-accent-200/40 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50/50 px-3 py-1 text-sm font-medium text-brand-700 backdrop-blur-sm mb-6">
                <span className="flex h-2 w-2 rounded-full bg-brand-600"></span>
                v2.0 is live: Better, faster, and more accurate.
              </div>
              
              <h1 className="font-heading text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl mb-6">
                Navigate your career with <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-600">
                  AI-Powered Precision
                </span>
              </h1>
              
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Stop guessing what skills you need. Upload your resume, define your dream role, and let our AI architect a personalized learning roadmap just for you.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link href="/upload">
                  <Button size="lg" className="w-full sm:w-auto group">
                    Analyze My Resume 
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    How it works
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-600" />
                  <span>Free Tier Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-600" />
                  <span>No Credit Card</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Visual (3D Tilt Mockup) */}
          <div className="flex-1 w-full max-w-[600px] lg:max-w-none">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              {/* Decorative Elements */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 opacity-20 blur-xl" />
              
              {/* Main Card */}
              <div className="relative rounded-2xl border border-slate-200/50 bg-white/90 p-2 shadow-2xl backdrop-blur-sm">
                <div className="rounded-xl bg-slate-50 border border-slate-100 overflow-hidden">
                  {/* Fake UI Header */}
                  <div className="flex items-center gap-2 border-b border-slate-100 bg-white px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                      <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                    </div>
                    <div className="ml-2 h-4 w-32 rounded-full bg-slate-100" />
                  </div>
                  
                  {/* Fake UI Content */}
                  <div className="p-6 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="h-6 w-48 rounded bg-slate-200" />
                        <div className="h-4 w-32 rounded bg-slate-100" />
                      </div>
                      <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                        92
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <div className="h-20 flex-1 rounded-lg bg-white border border-slate-100 shadow-sm p-3">
                           <div className="h-2 w-12 bg-green-100 rounded mb-2" />
                           <div className="h-3 w-3/4 bg-slate-100 rounded" />
                        </div>
                        <div className="h-20 flex-1 rounded-lg bg-white border border-slate-100 shadow-sm p-3">
                           <div className="h-2 w-12 bg-amber-100 rounded mb-2" />
                           <div className="h-3 w-3/4 bg-slate-100 rounded" />
                        </div>
                      </div>
                      <div className="h-24 w-full rounded-lg bg-slate-800 opacity-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 rounded-xl border border-slate-100 bg-white p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Skill Gap Analysis</p>
                    <p className="text-sm font-bold text-slate-900">Complete</p>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}