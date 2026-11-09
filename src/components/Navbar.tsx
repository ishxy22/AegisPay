'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, RefreshCw, Zap, UserCheck, AlertTriangle, LogOut } from 'lucide-react';

interface CurrentUser {
  userId: string;
  email: string;
  fullName: string;
  role: 'service_provider' | 'client' | 'admin';
}

export function Navbar() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);

  useEffect(() => {
    // Health capabilities check
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => {
        setIsDemoMode(data.capabilities?.isDemoMode ?? true);
      })
      .catch(() => setIsDemoMode(true));

    // Current session check
    fetch('/api/auth/me')
      .then((r) => {
        if (r.ok) return r.json();
        return null;
      })
      .then((data) => {
        if (data && data.authenticated && data.session) {
          setCurrentUser(data.session);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => setCurrentUser(null));
  }, []);

  const handleResetDemo = async () => {
    setIsResetting(true);
    try {
      await fetch('/api/demo/reset', { method: 'POST' });
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setIsResetting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setCurrentUser(null);
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-foreground">AegisPay</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                  B2B
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">Digital Commerce & Escrow Defense</p>
            </div>
          </Link>
        </div>

        {/* Center / Mode indicator */}
        <div className="flex items-center gap-3">
          {isDemoMode ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Interactive Demo Mode</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <Zap className="h-3.5 w-3.5" />
              <span>PayPal Sandbox Live</span>
            </div>
          )}

          {/* Reset Demo Scenario */}
          <button
            onClick={handleResetDemo}
            disabled={isResetting}
            title="Reload initial $3,000 Website Development benchmark scenario"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-muted hover:bg-muted/80 text-foreground border border-border transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-muted-foreground ${isResetting ? 'animate-spin' : ''}`} />
            <span>Load Demo Scenario</span>
          </button>
        </div>

        {/* Right / Role Switcher & Profile */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-foreground leading-tight">{currentUser.fullName}</span>
                <span className="text-[10px] text-muted-foreground uppercase font-medium">
                  {currentUser.role === 'service_provider' ? 'Developer / Provider' : currentUser.role === 'client' ? 'Client Buyer' : 'Administrator'}
                </span>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                {currentUser.role === 'service_provider' ? 'AX' : currentUser.role === 'client' ? 'NT' : 'AD'}
              </div>
              <button
                onClick={handleLogout}
                title="Sign out of AegisPay"
                className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-md text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
