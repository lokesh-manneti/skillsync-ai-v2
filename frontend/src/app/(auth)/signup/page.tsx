'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { AlertCircle, User, Lock, Mail, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post('/auth/signup', {
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName
      });
      await login(formData.email, formData.password);
      router.push('/upload');
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError('Email already registered. Please login.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-slate-200/60 bg-white/70 backdrop-blur-xl shadow-xl">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 border border-brand-100">
          <Sparkles className="h-6 w-6 text-brand-600" />
        </div>
        <CardTitle className="text-xl">Create your account</CardTitle>
        <p className="text-sm text-slate-500 mt-2">
          Start your career transformation journey today
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Full Name"
                className="pl-10 bg-white/50 focus:bg-white"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="email"
                placeholder="Email address"
                className="pl-10 bg-white/50 focus:bg-white"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
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
            Create Account
          </Button>

          <div className="mt-4 text-center text-sm">
            <span className="text-slate-500">Already have an account? </span>
            <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700 hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}