'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUp } from '@/lib/supabase/queries';
import FinancialParticles from '@/components/three/FinancialParticles';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/components/shared/AuthProvider';

export default function SignupPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  useEffect(() => {
    if (!formRef.current) return;
    gsap.fromTo(
      formRef.current.querySelectorAll('.anim-item'),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await signUp(email, password, name);
    setLoading(false);

    if (error) {
      console.error('Signup error:', error);
      const msg = error.message || '';
      if (msg.includes('Database error') || msg.includes('unexpected_failure')) {
        toast.error('Database error — run the SQL migration first', {
          description: 'Go to your Supabase SQL Editor and run the contents of supabase/migrations.sql',
        });
      } else {
        toast.error(msg || 'Signup failed. Check Supabase configuration.');
      }
      return;
    }

    toast.success('Account created! Check your email for confirmation.');
    if (data?.user?.identities?.length === 0) {
      toast.info('This email may already be registered. Try signing in.');
      return;
    }
    router.push('/dashboard');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0f1e]">
      <FinancialParticles />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0f1e]/60 to-[#0a0f1e]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />

      <div ref={formRef} className="relative z-10 w-full max-w-md mx-4">
        <div className="anim-item text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <svg width="36" height="36" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logog" x1="0" y1="0" x2="34" y2="34">
                  <stop offset="0%" stopColor="#10B981" /><stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              <path d="M17 2L30.5 9.5V16C30.5 24.5 24.5 30.5 17 33C9.5 30.5 3.5 24.5 3.5 16V9.5L17 2Z" fill="url(#logog)" />
              <path d="M12 13L17 23L22 13" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="17" cy="11" r="1.5" fill="#10B981" />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Start your financial journey</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="anim-item space-y-2">
              <Label htmlFor="name" className="text-gray-300">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input id="name" placeholder="Raj Patel" value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-xl" required />
              </div>
            </div>

            <div className="anim-item space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input id="email" type="email" placeholder="you@example.com" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-xl" required />
              </div>
            </div>

            <div className="anim-item space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-xl" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="anim-item">
              <Button type="submit" disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-5 font-semibold shadow-lg shadow-emerald-500/25 disabled:opacity-50">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">Create Account <ArrowRight className="h-4 w-4" /></span>
                )}
              </Button>
            </div>
          </form>

          <div className="anim-item mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">Sign in</Link>
            </p>
          </div>
          <div className="anim-item mt-6 pt-6 border-t border-white/5">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
              <Sparkles className="w-3 h-3" />
              <span>Protected by bank-grade encryption</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
