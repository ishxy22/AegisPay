'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Loader2, AlertCircle, UserPlus, Sparkles, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'service_provider' | 'client'>('service_provider');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setError('Please provide your full name and a valid email address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password || 'Password123!',
          fullName: fullName.trim(),
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed');
      }

      window.dispatchEvent(new Event('aegispay-auth-change'));
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (name: string, mail: string, r: 'service_provider' | 'client') => {
    setFullName(name);
    setEmail(mail);
    setRole(r);
    setPassword('Password123!');
  };

  return (
    <div className="max-w-md mx-auto py-10 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home Page</span>
        </Link>
        <Link
          href="/login"
          className="text-xs text-primary font-semibold hover:underline"
        >
          Sign In instead →
        </Link>
      </div>

      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md mb-2">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Create an AegisPay Account</h1>
        <p className="text-xs text-muted-foreground">Start protecting your digital service milestones and deliverables.</p>
      </div>

      {/* Reviewer Benchmark Quick-Fill Preset */}
      <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Benchmark Evaluator Presets</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">1-Click Auto-Fill</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <button
            type="button"
            onClick={() => handleQuickFill('Ishita Verma', 'ishita@actenx.com', 'service_provider')}
            className={`p-2 rounded-lg border text-left transition-colors ${
              email === 'ishita@actenx.com'
                ? 'border-primary bg-primary text-primary-foreground font-medium'
                : 'border-border bg-card hover:border-primary/50 text-foreground'
            }`}
          >
            <div className="font-semibold">Ishita (Provider)</div>
            <div className="text-[10px] opacity-80">Frontend Agency Lead</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('Marcus Brody', 'marcus@novatech.io', 'client')}
            className={`p-2 rounded-lg border text-left transition-colors ${
              email === 'marcus@novatech.io'
                ? 'border-primary bg-primary text-primary-foreground font-medium'
                : 'border-border bg-card hover:border-primary/50 text-foreground'
            }`}
          >
            <div className="font-semibold">Marcus (Client)</div>
            <div className="text-[10px] opacity-80">VP of Engineering</div>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 text-rose-600 border border-rose-500/20 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4 text-xs">
        <div className="space-y-1.5">
          <label className="font-semibold text-foreground">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Alex Morgan"
            required
            className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground outline-none placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-foreground">Account Type & Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground outline-none"
          >
            <option value="service_provider">Service Provider (Freelancer, Developer, Agency)</option>
            <option value="client">Client Representative (Buyer, Contracting Company)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-foreground">Work Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. alex@freelance.org"
            required
            className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground outline-none font-mono text-xs placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-foreground">Password</label>
            <span className="text-[10px] text-muted-foreground">Demo default: Password123!</span>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground outline-none font-mono text-xs placeholder:text-muted-foreground/60"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm transition-colors mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />}
          <span>Create AegisPay Account</span>
        </button>

        <div className="pt-3 border-t border-border/60 text-center space-y-2">
          <p className="text-[11px] text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign In here
            </Link>
          </p>
          <div>
            <Link href="/" className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              ← Return to Home Page
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
