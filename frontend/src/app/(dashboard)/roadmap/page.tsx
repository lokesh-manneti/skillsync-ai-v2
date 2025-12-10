'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { RoadmapBoard } from '@/components/features/roadmap/RoadmapBoard';
import { Loader2, Map } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function RoadmapPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data
  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile/me');
      setProfile(res.data);
    } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 2. Handle Checkbox Click
  const handleToggle = async (phaseIdx: number, itemIdx: number, currentStatus: boolean) => {
    if (!profile) return;

    // Optimistic UI Update (Instant feedback)
    const newProfile = JSON.parse(JSON.stringify(profile));
    newProfile.ai_analysis_json.roadmap[phaseIdx].action_items[itemIdx].completed = !currentStatus;
    setProfile(newProfile);

    // Send to Backend
    try {
      await api.patch('/profile/roadmap/toggle', {
        phase_index: phaseIdx,
        item_index: itemIdx,
        completed: !currentStatus
      });
    } catch (error) {
      console.error("Failed to save", error);
      fetchProfile(); // Revert on error
    }
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="h-[calc(100vh-100px)] w-full flex flex-col items-center justify-center text-brand-600">
        <Loader2 className="animate-spin h-10 w-10 mb-4" />
        <p className="text-slate-500 font-medium">Loading your roadmap...</p>
      </div>
    );
  }

  // --- Empty State ---
  if (!profile) {
    return (
      <div className="h-[calc(100vh-100px)] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Map className="text-slate-400 h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">No Roadmap Found</h2>
        <p className="text-slate-500 mt-2 mb-6">Upload a resume to generate your learning path.</p>
        <Link href="/upload">
          <Button>Create Roadmap</Button>
        </Link>
      </div>
    );
  }

  // --- Main Content ---
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      {/* Page Header */}
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-heading font-bold text-slate-900">Learning Roadmap</h1>
        <p className="text-slate-500">
          Your step-by-step guide to becoming a <span className="font-semibold text-brand-600">{profile.target_role}</span>
        </p>
      </div>
      
      {/* Kanban Board Area */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <RoadmapBoard 
          phases={profile.ai_analysis_json.roadmap} 
          onToggle={handleToggle}
        />
      </div>
    </div>
  );
}