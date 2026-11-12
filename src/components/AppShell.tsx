'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const isAuth = pathname === '/login' || pathname === '/register';

  // Public Landing Page (Immersive Full-Width, Dedicated Public Navigation)
  if (isLanding) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {children}
      </div>
    );
  }

  // Authentication Pages (Clean, focused view with top return header)
  if (isAuth) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Dedicated Auth Header */}
        <header className="w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
          <div className="max-w-5xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-foreground">AegisPay</span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-primary/10 text-primary">
                  ESCROW
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Auth Content */}
        <div className="flex-1 flex flex-col justify-center px-4 py-8">
          {children}
        </div>
      </div>
    );
  }

  // Application Dashboard & Internal Tools (With Sidebar & Internal App Header)
  return (
    <>
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </>
  );
}
