'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Upload, Map, MessageSquare, Zap, FileText, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Upload,
    title: "Smart Resume Parsing",
    desc: "Our engine extracts your skills and experience from any PDF instantly, preserving context.",
    color: "text-blue-600 bg-blue-50"
  },
  {
    icon: Map,
    title: "Dynamic Roadmaps",
    desc: "Get a week-by-week action plan tailored to your specific gaps with curated resources.",
    color: "text-violet-600 bg-violet-50"
  },
  {
    icon: MessageSquare,
    title: "AI Career Mentor",
    desc: "Chat with a context-aware AI mentor that knows your profile and answers your doubts.",
    color: "text-pink-600 bg-pink-50"
  },
  {
    icon: FileText,
    title: "ATS Resume Builder",
    desc: "Automatically rewrite your resume with your new skills to pass Applicant Tracking Systems.",
    color: "text-amber-600 bg-amber-50"
  },
  {
    icon: BarChart3,
    title: "Skill Gap Visualizer",
    desc: "See exactly where you stand against the market with interactive radar charts.",
    color: "text-emerald-600 bg-emerald-50"
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    desc: "No more waiting. Get analysis and actionable insights in under 30 seconds.",
    color: "text-cyan-600 bg-cyan-50"
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-slate-50/50">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-base font-semibold text-brand-600 uppercase tracking-wide">Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to level up
          </p>
          <p className="mt-4 text-lg text-slate-600">
            We don't just fix your resume; we build the bridge between where you are and where you want to be.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:border-brand-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                    <feature.icon size={24} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
