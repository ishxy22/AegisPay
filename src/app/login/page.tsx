'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Loader2, AlertCircle, UserCheck, Sparkles } from 'lucide-react';

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('fuzail@actenx.com');
  const [role, setRole] = useState<'service_provider' | 'client' | 'admin'>('service_provider');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid credentials');
      }

      window.dispatchEvent(new Event('aegispay-auth-change'));
      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (qEmail: string, qRole: 'service_provider' | 'client', qPass: string = 'Password123!') => {
    setEmail(qEmail);
    setRole(qRole);
    setPassword(qPass);
  };

  return (
    <div className="max-w-md mx-auto py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md mb-2">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Sign In to AegisPay</h1>
        <p className="text-xs text-muted-foreground">Digital commerce protection and payment defense platform.</p>
      </div>

      {/* Quick Test Logins for Reviewers */}
      <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Quick Benchmark Test Accounts</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <button
            type="button"
            onClick={() => handleQuickSelect('fuzail@actenx.com', 'service_provider')}
            className={`p-2 rounded-lg border text-left transition-colors ${
              email === 'fuzail@actenx.com'
                ? 'border-primary bg-primary text-primary-foreground font-medium'
                : 'border-border bg-card hover:border-primary/50 text-foreground'
            }`}
          >
            <div className="font-semibold">Fuzail (Provider)</div>
            <div className="text-[10px] opacity-80">Lead Developer / Agency</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect('finance@novatech.io', 'client')}
            className={`p-2 rounded-lg border text-left transition-colors ${
              email === 'finance@novatech.io'
                ? 'border-primary bg-primary text-primary-foreground font-medium'
                : 'border-border bg-card hover:border-primary/50 text-foreground'
            }`}
          >
            <div className="font-semibold">NovaTech (Client)</div>
            <div className="text-[10px] opacity-80">Client Representative</div>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 text-rose-600 border border-rose-500/20 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4 text-xs">
        <div className="space-y-1.5">
          <label className="font-semibold text-foreground">Operating Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground outline-none"
          >
            <option value="service_provider">Service Provider (Developer / Agency)</option>
            <option value="client">Client Representative (Buyer)</option>
            <option value="admin">Platform Administrator / Arbitrator</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-foreground">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground outline-none font-mono text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-foreground">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground outline-none font-mono text-xs"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm transition-colors mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserCheck className="h-3.5 w-3.5" />}
          <span>Sign In to AegisPay</span>
        </button>

        <p className="text-center text-[11px] text-muted-foreground pt-2">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Register new account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto py-16 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span>Loading AegisPay Authentication...</span>
        </div>
      }
    >
      <LoginFormInner />
    </Suspense>
  );
}
