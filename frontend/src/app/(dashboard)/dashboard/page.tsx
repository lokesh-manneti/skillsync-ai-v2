'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { 
  Target, 
  TrendingUp, 
  AlertCircle, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { StatCard } from '@/components/features/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import SkillRadar from '@/components/SkillRadar'; // Reuse your existing chart component

// Define Types (Same as before)
// ... Copy interfaces from your old dashboard page here ... 
// (ActionItem, RoadmapPhase, Profile, etc.)

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null); // Use proper type
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get('/profile/me');
        setProfile(res.data);
      } catch (e) {
        console.error("Failed to load profile", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // --- Loading State ---
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  // --- Empty State ---
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mb-6">
          <Target className="text-brand-600 h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No Analysis Found</h2>
        <p className="text-slate-500 max-w-md mt-2 mb-8">
          Upload your resume to generate your personalized career roadmap and skill gap analysis.
        </p>
        <Link href="/upload">
          <Button size="lg">Start New Analysis</Button>
        </Link>
      </div>
    );
  }

  // --- Main Dashboard ---
  const stats = profile.ai_analysis_json;
  const missingCount = stats.missing_skills?.length || 0;
  
  // Container Animation
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Overview for <span className="font-semibold text-brand-600">{profile.target_role}</span></p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div variants={item}>
          <StatCard 
            title="Match Score" 
            value={`${stats.match_score}%`} 
            icon={Target} 
            color="bg-brand-500"
            trend={stats.match_score > 70 ? "Market Ready" : "Needs Work"}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard 
            title="Missing Skills" 
            value={missingCount} 
            icon={AlertCircle} 
            color="bg-amber-500" 
            trend="Critical Gaps"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard 
            title="Est. Learning Time" 
            value="4 Weeks" 
            icon={TrendingUp} 
            color="bg-emerald-500"
            trend="Based on roadmap" 
          />
        </motion.div>
      </div>

      {/* Charts & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Executive Summary */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>AI Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed">
                {stats.executive_summary}
              </p>
              <div className="mt-6 flex gap-3">
                <Link href="/roadmap">
                  <Button>View Full Roadmap</Button>
                </Link>
                <Link href="/resume">
                  <Button variant="secondary">Optimize Resume</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Radar Chart */}
        <motion.div variants={item}>
          <Card className="h-full min-h-[300px] flex flex-col">
            <CardHeader>
              <CardTitle>Skill Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="w-full h-[250px]">
                <SkillRadar data={stats.skill_breakdown || []} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Roadmap Preview */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Current Focus</h2>
          <Link href="/roadmap" className="text-sm text-brand-600 hover:underline flex items-center">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.roadmap?.slice(0, 2).map((phase: any, idx: number) => (
            <Card key={idx} className="border-l-4 border-l-brand-500">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-slate-900">{phase.phase}</h4>
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{phase.week}</span>
                </div>
                <ul className="space-y-2 mt-3">
                  {phase.topics?.slice(0, 3).map((topic: string, tIdx: number) => (
                    <li key={tIdx} className="flex items-center text-sm text-slate-600">
                      <BookOpen className="h-3 w-3 mr-2 text-slate-400" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
}