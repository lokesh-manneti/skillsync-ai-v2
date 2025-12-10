'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { ResumePreview } from '@/components/features/resume/ResumePreview';
import { Loader2, Sparkles, FileText, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResumePage() {
  const [resumeContent, setResumeContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateResume = async () => {
    setIsLoading(true);
    try {
      const res = await api.post('/profile/optimize_resume');
      setResumeContent(res.data.optimized_content);
    } catch (error) {
      console.error("Failed to generate resume");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-slate-900">Resume Studio</h1>
        <p className="text-slate-500">Generate an ATS-optimized LaTeX resume integrated with your new skills.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left Panel: Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Info Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
              <Wand2 size={24} />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">AI Optimization</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Our engine will rewrite your summary and bullet points to include the skills you've marked as "Complete" in your roadmap.
            </p>
            
            <Button 
              onClick={generateResume} 
              isLoading={isLoading}
              className="w-full"
              size="lg"
            >
              {resumeContent ? 'Regenerate Resume' : 'Generate Resume'}
              {!isLoading && <Sparkles className="ml-2 h-4 w-4" />}
            </Button>
          </div>

          {/* Tips Card */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 flex-1">
            <h4 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wide">Pro Tips</h4>
            <ul className="space-y-3">
              {[
                "Open in Overleaf to export as PDF",
                "First time? You'll need to create a free Overleaf account", // <--- ADDED
                "Review the 'Skills' section for new additions",
                "Ensure your target role is up to date"
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <div className="min-w-[6px] h-[6px] rounded-full bg-brand-400 mt-1.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Panel: Preview */}
        <div className="lg:col-span-8 h-full min-h-[500px]">
          <AnimatePresence mode='wait'>
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-inner"
              >
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-slate-100 rounded-full" />
                  <div className="absolute inset-0 w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto text-indigo-600 h-8 w-8 animate-pulse" />
                </div>
                <p className="mt-6 text-slate-600 font-medium animate-pulse">Writing your resume...</p>
              </motion.div>
            ) : resumeContent ? (
              <ResumePreview content={resumeContent} />
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center p-8"
              >
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                  <FileText className="text-slate-400 h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">No Resume Generated</h3>
                <p className="text-slate-500 max-w-sm mt-2">
                  Click the generate button to create a tailored LaTeX resume based on your profile.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}