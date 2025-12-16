'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Briefcase, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
// 1. Ensure this import exists
import { useToast } from "@/components/ui/use-toast"; 

const steps = [
  { id: 1, title: 'Target Role', icon: Briefcase },
  { id: 2, title: 'Upload Resume', icon: Upload },
  { id: 3, title: 'Analysis', icon: CheckCircle2 },
];

export function UploadWizard() {
  const router = useRouter();
  // 2. Initialize the toast hook
  const { toast } = useToast(); 
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({ role: '', level: 'Fresher' });
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (currentStep === 1 && !formData.role) return;
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (e.dataTransfer.files[0].type === 'application/pdf') {
        setFile(e.dataTransfer.files[0]);
      }
    }
  };

  const handleSubmit = async () => {
    if (!file || !formData.role) return;
    
    setIsSubmitting(true);
    setCurrentStep(3); // Move to analysis step

    const data = new FormData();
    data.append('target_role', formData.role);
    data.append('experience_level', formData.level);
    data.append('file', file);

    try {
      await api.post('/profile/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Add a small artificial delay so user sees the success animation
      setTimeout(() => router.push('/dashboard'), 2000);
      
    } catch (error: any) {
      console.error(error);
      setIsSubmitting(false);
      setCurrentStep(2); // Go back to upload step on error

      // --- NEW: Handle Rate Limit Error (429) ---
      if (error.response && error.response.status === 429) {
        toast({
          title: "Daily Limit Reached 🛑",
          description: error.response.data.detail, // e.g., "Daily upload limit reached (2/day)..."
          variant: "destructive",
        });
      } else {
        // Generic Error
        toast({
          title: "Upload Failed",
          description: error.response?.data?.detail || "Something went wrong analyzing your resume. Please try again.",
          variant: "destructive",
        });
      }
      // ------------------------------------------
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Stepper Header */}
      <div className="flex justify-between items-center mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10" />
        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          return (
            <div key={step.id} className="flex flex-col items-center bg-slate-50 px-2">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isActive || isCompleted ? '#2563eb' : '#fff',
                  borderColor: isActive || isCompleted ? '#2563eb' : '#e2e8f0',
                  color: isActive || isCompleted ? '#fff' : '#64748b',
                }}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors duration-300 z-10`}
              >
                <step.icon size={18} />
              </motion.div>
              <span className={cn("text-xs font-medium mt-2", isActive ? "text-brand-600" : "text-slate-500")}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <Card className="min-h-[400px] flex flex-col p-8 bg-white/80 backdrop-blur-xl shadow-2xl border-slate-100">
        <AnimatePresence mode='wait'>
          
          {/* STEP 1: JOB DETAILS */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Define your goal</h2>
              <p className="text-slate-500 mb-8">What role are you aiming for?</p>
              
              <div className="space-y-6 flex-1">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Target Role</label>
                  <Input 
                    placeholder="e.g. Senior React Developer" 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Experience Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Fresher', 'Mid-Level', 'Senior'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setFormData({...formData, level})}
                        className={cn(
                          "px-4 py-3 rounded-xl border text-sm font-medium transition-all",
                          formData.level === level 
                            ? "border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500" 
                            : "border-slate-200 hover:border-slate-300 text-slate-600"
                        )}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button onClick={handleNext} disabled={!formData.role}>
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: UPLOAD */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Upload Resume</h2>
              <p className="text-slate-500 mb-8">PDF format only, max 5MB.</p>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
                onDragLeave={() => setIsDragActive(false)}
                onDrop={handleFileDrop}
                className={cn(
                  "flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-all duration-300 cursor-pointer",
                  isDragActive ? "border-brand-500 bg-brand-50 scale-[1.02]" : "border-slate-200 hover:border-slate-300",
                  file ? "border-green-500 bg-green-50/30" : ""
                )}
              >
                {file ? (
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={32} />
                    </div>
                    <p className="text-sm font-medium text-slate-900">{file.name}</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setFile(null); }} 
                      className="text-xs text-red-500 hover:underline mt-2"
                    >
                      Remove file
                    </button>
                  </motion.div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload size={32} />
                    </div>
                    <p className="text-sm font-medium text-slate-900">Drag & drop your PDF here</p>
                    <p className="text-xs text-slate-400 mt-2">or click to browse</p>
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      accept="application/pdf"
                      onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                    />
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="ghost" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={handleSubmit} disabled={!file} isLoading={isSubmitting}>
                  Analyze Resume
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: LOADING / SUCCESS */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center py-12"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-slate-100" />
                <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-brand-600 border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Briefcase className="text-brand-600 animate-pulse" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mt-8">Analyzing Profile...</h3>
              <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                Gemini is identifying your skill gaps and building your roadmap.
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </Card>
    </div>
  );
}