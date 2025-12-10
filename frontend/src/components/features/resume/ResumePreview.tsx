'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ExternalLink, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ResumePreviewProps {
  content: string;
}

export function ResumePreview({ content }: ResumePreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOverleaf = () => {
    const form = document.createElement('form');
    form.action = 'https://www.overleaf.com/docs';
    form.method = 'POST';
    form.target = '_blank';

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'snip';
    input.value = content;

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "SkillSync_Resume.tex";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative flex flex-col h-full bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-slate-700"
    >
      {/* Toolbar - Now Scrollable on Mobile */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-white/10 gap-4 overflow-x-auto no-scrollbar">
        
        {/* Filename (Hidden on very small screens) */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-3 text-xs font-mono text-slate-400">resume.tex</span>
        </div>

        <div className="flex items-center gap-2 flex-nowrap ml-auto">
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 px-2 text-slate-300 hover:text-white hover:bg-white/10 whitespace-nowrap">
            {copied ? <Check size={14} className="sm:mr-1.5 text-green-400" /> : <Copy size={14} className="sm:mr-1.5" />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
          </Button>
          
          <Button variant="ghost" size="sm" onClick={handleDownload} className="h-8 px-2 text-slate-300 hover:text-white hover:bg-white/10 whitespace-nowrap">
            <Download size={14} className="sm:mr-1.5" />
            <span className="hidden sm:inline">.tex</span>
          </Button>
          
          <Button size="sm" onClick={handleOverleaf} className="h-8 px-3 bg-green-600 hover:bg-green-700 border-0 text-white shadow-md shadow-green-900/20 whitespace-nowrap">
            <ExternalLink size={14} className="mr-1.5" />
            Open in Overleaf
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <SyntaxHighlighter
          language="latex"
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            background: 'transparent',
            fontSize: '14px',
            lineHeight: '1.6',
          }}
          showLineNumbers={true}
          wrapLines={true}
        >
          {content}
        </SyntaxHighlighter>
      </div>
    </motion.div>
  );
}