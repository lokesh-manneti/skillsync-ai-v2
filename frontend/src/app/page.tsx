'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/features/landing/Hero";
import { Features } from "@/components/features/landing/Features";

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard immediately
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Optional: Return null or a loading spinner while redirecting 
  // to prevent a "flash" of the landing page content.
  // However, keeping the landing page visible for a split second is often 
  // acceptable if you want to ensure SEO crawlers still see content.
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}