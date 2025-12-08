'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { 
  AlertTriangle, 
  Map, 
  Loader2, 
  BarChart3, 
  FileText, 
  MessageSquare,
  Check
} from 'lucide-react';
import SkillRadar from '@/components/SkillRadar';

// --- Interfaces ---
interface ActionItem {
  task: string;
  completed: boolean;
}

interface RoadmapPhase {
  phase: string;
  week: string;
  topics: string[];
  action_items: ActionItem[];
}

interface SkillBreakdown {
  category: string;
  score: number;
}

interface AIAnalysis {
  match_score: number;
  executive_summary: string;
  skill_breakdown: SkillBreakdown[];
  missing_skills: string[];
  roadmap: RoadmapPhase[];
}

interface Profile {
  target_role: string;
  experience_level: string;
  ai_analysis_json: AIAnalysis;
}

export default function Dashboard() {
  const { isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Auth Guard
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    } else {
      fetchProfile();
    }
  }, [isAuthenticated, router]);

  // 2. Data Fetching
  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile/me');
      setProfile(res.data);
    } catch (err) {
      console.log("No profile found");
    } finally {
      setLoading(false);
    }
  };

  // 3. Interactive Roadmap Toggle
  const toggleItem = async (phaseIdx: number, itemIdx: number, currentStatus: boolean) => {
    if (!profile) return;

    // Optimistic UI Update (Update state immediately)
    const newProfile = JSON.parse(JSON.stringify(profile)); // Deep clone
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header --- */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Career Dashboard</h1>
            <p className="text-gray-500 mt-1">
              {profile ? `Optimizing for: ${profile.target_role}` : 'Welcome to SkillSync'}
            </p>
          </div>
          <button 
            onClick={() => logout()} 
            className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* --- State: No Profile --- */}
        {!profile ? (
          <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Let's build your roadmap</h2>
            <p className="text-gray-600 mb-8">Upload your resume to get a personalized analysis.</p>
            <Link 
              href="/upload" 
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all"
            >
              Start New Analysis
            </Link>
          </div>
        ) : (
          
          /* --- State: Results --- */
          <div className="space-y-8">
            
            {/* Top Row: Stats & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Radar Chart Card */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest absolute top-4 left-4">Skill Assessment</h3>
                <div className="w-full h-64 mt-4">
                  <SkillRadar data={profile.ai_analysis_json.skill_breakdown || []} />
                </div>
              </div>

              {/* Executive Summary Card */}
              <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-indigo-500"/> Executive Summary
                    </h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold border border-green-200">
                      {profile.ai_analysis_json.match_score}% Match
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {profile.ai_analysis_json.executive_summary}
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6 justify-end border-t border-gray-50 pt-4">
                  <Link 
                    href="/resume"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                    Open Resume Builder
                  </Link>

                  <Link 
                    href="/chat" 
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat with Mentor
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Row: Gaps & Roadmap */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Missing Skills */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit sticky top-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-amber-500"/> Missing Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.ai_analysis_json.missing_skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-amber-50 text-amber-700 text-sm font-medium rounded-full border border-amber-100">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                   <Link href="/upload" className="text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                     Upload newer resume →
                   </Link>
                </div>
              </div>

              {/* Interactive Roadmap */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                  <Map className="text-indigo-600 h-5 w-5" />
                  <h3 className="text-xl font-bold text-gray-900">Your Learning Roadmap</h3>
                </div>
                
                {profile.ai_analysis_json.roadmap.map((phase, phaseIdx) => (
                  <div key={phaseIdx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
                    {/* Phase Header */}
                    <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                      <h4 className="font-bold text-gray-900 text-base">{phase.phase}</h4>
                      <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md uppercase tracking-wide">
                        {phase.week}
                      </span>
                    </div>
                    
                    <div className="p-5 space-y-4">
                      {/* Topics */}
                      <div className="flex flex-wrap gap-2">
                        {phase.topics.map((t, i) => (
                          <span key={i} className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Action Items (Checkboxes) */}
                      <div className="space-y-2 pt-2">
                        {phase.action_items.map((item, itemIdx) => (
                          <div 
                            key={itemIdx} 
                            onClick={() => toggleItem(phaseIdx, itemIdx, item.completed)}
                            className={`group flex items-start p-3 rounded-lg cursor-pointer border transition-all duration-200 ${
                              item.completed 
                                ? 'bg-green-50 border-green-100' 
                                : 'bg-white border-transparent hover:border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                              item.completed 
                                ? 'bg-green-500 border-green-500 shadow-sm' 
                                : 'border-gray-300 bg-white group-hover:border-indigo-400'
                            }`}>
                              {item.completed && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                            </div>
                            <span className={`ml-3 text-sm leading-relaxed transition-colors ${
                              item.completed ? 'text-green-800 line-through decoration-green-300' : 'text-gray-700'
                            }`}>
                              {item.task}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}