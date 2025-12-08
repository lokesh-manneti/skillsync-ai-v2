'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/lib/api';
import { 
  ArrowLeft, 
  Loader2, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  FileText,
  ExternalLink 
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function ResumePage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [resumeContent, setResumeContent] = useState('');
  const [completedCount, setCompletedCount] = useState(0);
  const [copied, setCopied] = useState(false);

  // 1. Auth Guard & Context
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    fetchContext();
  }, [isAuthenticated, router]);

  const fetchContext = async () => {
    try {
      const res = await api.get('/profile/me');
      let count = 0;
      const roadmap = res.data.ai_analysis_json?.roadmap || [];
      roadmap.forEach((phase: any) => {
        phase.action_items?.forEach((item: any) => {
          if (item.completed) count++;
        });
      });
      setCompletedCount(count);
    } catch (err) {
      console.error(err);
    }
  };

  // 2. Generate LaTeX Resume
  const generateResume = async () => {
    setLoading(true);
    try {
      const res = await api.post('/profile/optimize_resume');
      setResumeContent(res.data.optimized_content);
    } catch (error) {
      setResumeContent("% Error: Failed to generate resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Actions
  const copyToClipboard = () => {
    navigator.clipboard.writeText(resumeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadLatex = () => {
    const element = document.createElement("a");
    const file = new Blob([resumeContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "resume.tex";
    document.body.appendChild(element);
    element.click();
  };

  const openInOverleaf = () => {
    // 1. Create a hidden form
    const form = document.createElement('form');
    form.action = 'https://www.overleaf.com/docs';
    form.method = 'POST';
    form.target = '_blank'; // Open in new tab

    // 2. Add the LaTeX content as a hidden input
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'snip'; // Overleaf expects the field name 'snip'
    input.value = resumeContent;
    
    // 3. Submit and cleanup
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-indigo-600" />
              LaTeX Resume Builder
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Integrating {completedCount} new skills into a professional template
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {resumeContent && (
            <>
              <button 
                onClick={openInOverleaf}
                className="hidden md:inline-flex items-center px-4 py-2 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in Overleaf
              </button>
              
              <button 
                onClick={copyToClipboard}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {copied ? <Check className="w-4 h-4 mr-2 text-green-600" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              
              <button 
                onClick={downloadLatex}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                .tex
              </button>
            </>
          )}
          
          <button 
            onClick={generateResume}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm disabled:opacity-70 transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            {resumeContent ? 'Regenerate' : 'Generate LaTeX'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto h-full">
          {!resumeContent ? (
            /* Empty State */
            <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="w-10 h-10 text-indigo-300" />
              </div>
              <p className="text-xl font-semibold text-gray-600">Ready to build</p>
              <p className="text-sm max-w-sm text-center mt-2 text-gray-500">
                Click <span className="font-bold text-gray-700">"Generate LaTeX"</span> to have AI architect a professional resume code for you.
              </p>
            </div>
          ) : (
            /* Code Viewer */
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-700 bg-[#1e1e1e]">
              <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-black/20">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"/>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                  <div className="w-3 h-3 rounded-full bg-green-500"/>
                </div>
                <span className="text-xs text-gray-400 font-mono">resume.tex</span>
              </div>
              
              <SyntaxHighlighter 
                language="latex" 
                style={vscDarkPlus}
                customStyle={{ 
                  margin: 0, 
                  padding: '1.5rem', 
                  fontSize: '0.9rem', 
                  lineHeight: '1.5',
                  minHeight: '70vh'
                }}
                showLineNumbers={true}
                wrapLongLines={true}
              >
                {resumeContent}
              </SyntaxHighlighter>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}