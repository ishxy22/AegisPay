'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Loader2, AlertCircle, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('Ishita Verma');
  const [email, setEmail] = useState('ishita@actenx.com');
  const [password, setPassword] = useState('Password123!');
  const [role, setRole] = useState<'service_provider' | 'client'>('service_provider');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, role }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md mb-2">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Create an AegisPay Account</h1>
        <p className="text-xs text-muted-foreground">Start protecting your digital service milestones.</p>
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
            required
            className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-foreground">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground outline-none"
          >
            <option value="service_provider">Service Provider (Developer / Agency)</option>
            <option value="client">Client (Hiring / Contracting)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-foreground">Work Email</label>
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
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />}
          <span>Create Account</span>
        </button>

        <p className="text-center text-[11px] text-muted-foreground pt-2">
          Already registered?{' '}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
