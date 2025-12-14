'use client';

// Add these imports
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
// ... keep existing imports (UploadWizard, Navbar) ...
import { UploadWizard } from "@/components/features/upload/UploadWizard";
import { Navbar } from "@/components/layout/Navbar";

export default function UploadPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // --- ADD THIS PROTECTION BLOCK ---
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null; // Prevent flashing content
  // --------------------------------

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      <main className="pt-24 px-4">
        {/* ... rest of your existing JSX ... */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-heading font-bold text-slate-900">Let's build your profile</h1>
          <p className="text-slate-500 mt-2">Follow the steps to get your personalized roadmap.</p>
        </div>
        <UploadWizard />
      </main>
    </div>
  );
}