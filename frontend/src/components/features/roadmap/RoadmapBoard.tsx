'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, BookOpen, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

// Types matching your Backend Response
interface Task {
  task: string;
  completed: boolean;
}

interface Phase {
  phase: string;
  week: string;
  topics: string[];
  action_items: Task[];
}

interface RoadmapBoardProps {
  phases: Phase[];
  onToggle: (phaseIdx: number, itemIdx: number, currentStatus: boolean) => void;
}

export function RoadmapBoard({ phases, onToggle }: RoadmapBoardProps) {
  
  const handleCheck = (phaseIdx: number, itemIdx: number, completed: boolean) => {
    // Optimistic UI interaction
    if (!completed) {
      // Trigger confetti only when marking AS complete
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#2563eb', '#7c3aed', '#10b981'],
        zIndex: 9999
      });
    }
    onToggle(phaseIdx, itemIdx, completed);
  };

  if (!phases || phases.length === 0) {
    return <div className="text-slate-500">No roadmap data available.</div>;
  }

  return (
    <div className="flex gap-6 h-full overflow-x-auto pb-4 items-start snap-x">
      {phases.map((phase, phaseIdx) => {
        // Calculate Progress per column
        const total = phase.action_items.length;
        const completedCount = phase.action_items.filter(i => i.completed).length;
        const progress = total === 0 ? 0 : (completedCount / total) * 100;
        const isPhaseComplete = progress === 100;

        return (
          <motion.div
            key={phaseIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: phaseIdx * 0.1 }}
            className="flex-shrink-0 w-[350px] flex flex-col h-full snap-center"
          >
            {/* Column Header */}
            <div className={cn(
              "rounded-t-2xl p-5 border-b-4 shadow-sm border-x border-t transition-colors duration-300",
              isPhaseComplete 
                ? "bg-green-50 border-green-500 border-x-green-100 border-t-green-100" 
                : "bg-white border-brand-500 border-slate-200"
            )}>
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-slate-900 text-lg line-clamp-1" title={phase.phase}>
                  {phase.phase}
                </h3>
                <span className="text-xs font-mono font-medium px-2 py-1 bg-slate-100 rounded text-slate-600 whitespace-nowrap">
                  {phase.week}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full transition-all",
                      isPhaseComplete ? "bg-green-500" : "bg-brand-500"
                    )}
                  />
                </div>
                <span className="text-xs font-bold text-slate-500 w-8 text-right">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>

            {/* Tasks Container */}
            <div className="flex-1 bg-slate-50/50 border-x border-b border-slate-200 rounded-b-2xl p-4 space-y-3 overflow-y-auto custom-scrollbar">
              
              {/* Topics Tags */}
              {phase.topics && phase.topics.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {phase.topics.map((t, i) => (
                    <span key={i} className="inline-flex items-center text-[10px] uppercase tracking-wider font-bold text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-md">
                      <BookOpen size={10} className="mr-1" /> {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Items */}
              {phase.action_items.map((item, itemIdx) => (
                <motion.div
                  key={itemIdx}
                  layout
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCheck(phaseIdx, itemIdx, item.completed)}
                  className={cn(
                    "group relative p-4 rounded-xl border cursor-pointer transition-all duration-200 shadow-sm",
                    item.completed 
                      ? "bg-green-50/50 border-green-200 opacity-75 hover:opacity-100" 
                      : "bg-white border-slate-200 hover:border-brand-300 hover:shadow-md"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-300",
                      item.completed 
                        ? "bg-green-500 border-green-500 text-white scale-110" 
                        : "border-slate-300 group-hover:border-brand-500 bg-white"
                    )}>
                      {item.completed && <CheckCircle2 size={14} />}
                    </div>
                    <span className={cn(
                      "text-sm font-medium transition-all duration-300 leading-snug",
                      item.completed ? "text-green-800 line-through decoration-green-300" : "text-slate-700"
                    )}>
                      {item.task}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}