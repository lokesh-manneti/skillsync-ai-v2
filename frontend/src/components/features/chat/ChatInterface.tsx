'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

const QUICK_ACTIONS = [
  "How do I improve my skills?",
  "Explain the first roadmap phase",
  "Mock interview question",
  "Resume tips"
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'ai', 
      content: 'Hello! I analyzed your profile. I can help you find resources, explain concepts, or practice for interviews. What shall we tackle first?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.post('/chat/', { message: text });
      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'ai', 
        content: res.data.response 
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'ai', 
        content: "I'm having trouble connecting to the brain right now. Please try again." 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-8rem)] bg-white/50 backdrop-blur-sm border-slate-200 shadow-xl overflow-hidden relative">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-white/80 backdrop-blur-md z-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center text-white shadow-lg">
          <Bot size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">AI Career Mentor</h3>
          <p className="text-xs text-green-600 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> Online
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={cn(
              "flex gap-3 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            {/* Avatar */}
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm mt-1",
              msg.role === 'user' ? "bg-slate-200 text-slate-600" : "bg-brand-100 text-brand-600"
            )}>
              {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
            </div>

            {/* Bubble */}
            <div className={cn(
              "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
              msg.role === 'user' 
                ? "bg-slate-900 text-white rounded-tr-none" 
                : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
            )}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {/* Typing Indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex gap-3 max-w-[85%] mr-auto"
            >
              <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={14} />
              </div>
              <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center h-12">
                <motion.div className="w-1.5 h-1.5 bg-brand-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity }} />
                <motion.div className="w-1.5 h-1.5 bg-brand-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                <motion.div className="w-1.5 h-1.5 bg-brand-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-100">
        {/* Quick Actions (Only show if no input and not loading) */}
        {!input && !isLoading && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-2 no-scrollbar">
            {QUICK_ACTIONS.map((action, i) => (
              <button
                key={i}
                onClick={() => handleSend(action)}
                className="whitespace-nowrap px-3 py-1.5 bg-slate-50 hover:bg-brand-50 hover:text-brand-600 border border-slate-200 hover:border-brand-200 rounded-full text-xs font-medium text-slate-600 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        )}

        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2 items-center relative"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your career roadmap..."
            className="flex-1 bg-slate-50 border-0 focus:ring-2 focus:ring-brand-500/20 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all shadow-inner"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim() || isLoading}
            className="h-11 w-11 rounded-xl shadow-md shrink-0"
          >
            {isLoading ? <StopCircle size={18} /> : <Send size={18} />}
          </Button>
        </form>
      </div>
    </Card>
  );
}