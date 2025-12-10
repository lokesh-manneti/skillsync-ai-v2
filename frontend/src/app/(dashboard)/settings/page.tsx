'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { User, RefreshCw, LogOut, Mail, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const { logout } = useAuthStore();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile/me');
        setProfile(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Manage your profile and preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-brand-500" />
              Profile Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
              <div className="mt-1 p-3 bg-slate-50 rounded-lg text-slate-900 font-medium">
                {profile.full_name}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
              <div className="mt-1 p-3 bg-slate-50 rounded-lg text-slate-900 font-medium flex items-center gap-2">
                <Mail size={16} className="text-slate-400" />
                {profile.email}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Target Role</label>
              <div className="mt-1 p-3 bg-slate-50 rounded-lg text-slate-900 font-medium flex items-center gap-2">
                <Briefcase size={16} className="text-slate-400" />
                {profile.target_role}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card className="border-red-100">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
              <RefreshCw className="h-5 w-5 text-amber-500" />
              Career Reset
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="max-w-md">
                <h4 className="font-medium text-slate-900">Re-analyze Resume</h4>
                <p className="text-sm text-slate-500 mt-1">
                  Want to switch career paths? Uploading a new resume will regenerate your entire roadmap and chat history.
                </p>
              </div>
              <Link href="/upload">
                <Button variant="secondary" className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800">
                  Upload New Resume
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => logout()}>
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}