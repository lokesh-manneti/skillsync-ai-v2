'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { AlertCircle, User, Lock, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  // State for form, errors, and strength
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '' // Added confirm password
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // 1. Calculate Password Strength Logic
  useEffect(() => {
    const pass = formData.password;
    let score = 0;
    if (!pass) {
      setPasswordStrength(0);
      return;
    }
    if (pass.length > 7) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    setPasswordStrength(score);
  }, [formData.password]);

  // 2. Handle Input Changes with Validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Strict Name Validation: Only letters, spaces, hyphens
    if (name === 'fullName') {
      if (value !== '' && !/^[a-zA-Z\s-]+$/.test(value)) return;
      if (value.length > 50) return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear specific field error on type
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Clear global error
    if (error) setError('');
  };

  // 3. Validation Rules
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    else if (formData.fullName.length < 2) errors.fullName = "Name must be at least 2 characters";

    if (!formData.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid email format";

    if (!formData.password) errors.password = "Password is required";
    else if (formData.password.length < 8) errors.password = "Min 8 characters";

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

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

  // Helper for strength colors
  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-amber-500";
    if (passwordStrength >= 3) return "bg-green-500";
    return "bg-slate-200";
  };

  const getStrengthLabel = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength === 3) return "Medium";
    return "Strong";
  };

  return (
    <Card className="border-slate-200/60 bg-white/70 backdrop-blur-xl shadow-xl w-full max-w-lg">
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

          {/* Full Name */}
          <div className="space-y-1">
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                name="fullName"
                type="text"
                placeholder="Full Name"
                maxLength={35}
                className={`pl-10 bg-white/50 focus:bg-white ${validationErrors.fullName ? 'border-red-300 focus-visible:ring-red-500' : ''}`}
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            {validationErrors.fullName && <p className="text-xs text-red-500 ml-1">{validationErrors.fullName}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                name="email"
                type="email"
                placeholder="Email address"
                className={`pl-10 bg-white/50 focus:bg-white ${validationErrors.email ? 'border-red-300 focus-visible:ring-red-500' : ''}`}
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {validationErrors.email && <p className="text-xs text-red-500 ml-1">{validationErrors.email}</p>}
          </div>

          {/* Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Password Column */}
            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className={`pl-10 bg-white/50 focus:bg-white ${validationErrors.password ? 'border-red-300 focus-visible:ring-red-500' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {/* Strength Meter */}
              {formData.password && (
                <div className="mt-1.5 px-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Strength</span>
                    <span className="text-[10px] font-medium text-slate-600">{getStrengthLabel()}</span>
                  </div>
                  <div className="h-1 w-full bg-slate-200/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ease-out ${getStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              {validationErrors.password && <p className="text-xs text-red-500 ml-1">{validationErrors.password}</p>}
            </div>

            {/* Confirm Password Column */}
            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm"
                  className={`pl-10 bg-white/50 focus:bg-white ${validationErrors.confirmPassword ? 'border-red-300 focus-visible:ring-red-500' : ''}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              {validationErrors.confirmPassword && <p className="text-xs text-red-500 ml-1">{validationErrors.confirmPassword}</p>}
            </div>
          </div>

          {/* Global Error Message */}
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