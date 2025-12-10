'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { AlertCircle, ArrowRight, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-slate-200/60 bg-white/70 backdrop-blur-xl shadow-xl">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <p className="text-sm text-slate-500 mt-2">
          Enter your credentials to access your workspace
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="email"
                placeholder="Email address"
                className="pl-10 bg-white/50 focus:bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="password"
                placeholder="Password"
                className="pl-10 bg-white/50 focus:bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100"
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </motion.div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            isLoading={isLoading}
          >
            Sign In <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <div className="mt-4 text-center text-sm">
            <span className="text-slate-500">Don't have an account? </span>
            <Link href="/signup" className="font-semibold text-brand-600 hover:text-brand-700 hover:underline">
              Create one for free
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}