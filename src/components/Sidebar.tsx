'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderGit2,
  FileCheck2,
  Receipt,
  FileText,
  Scale,
  ShieldAlert,
  BarChart3,
  PlayCircle,
  Hash,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Workspace',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Projects & Escrow', href: '/projects', icon: FolderGit2 },
      { name: 'Transactions Ledger', href: '/transactions', icon: Receipt },
      { name: 'PayPal Invoices', href: '/invoices', icon: FileText },
    ],
  },
  {
    title: 'Protection & Defense',
    items: [
      {
        name: 'Fulfillment Inspector',
        href: '/projects/proj_web_dev_3000/verification',
        icon: FileCheck2,
      },
      {
        name: 'AI Mediation',
        href: '/mediation',
        icon: Scale,
        badge: '1 Active',
        badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
      },
      {
        name: 'Dispute Defense',
        href: '/defense',
        icon: ShieldAlert,
        badge: 'Action Req',
        badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
      },
    ],
  },
  {
    title: 'Auditing & Tools',
    items: [
      { name: 'Receipt Verifier', href: '/verify', icon: Hash },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-sidebar-bg text-sidebar-fg border-r border-sidebar-border hidden md:flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Scrollable Navigation Groups */}
      <div className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 pb-1.5 text-[10px] font-mono font-bold tracking-wider text-sidebar-muted uppercase">
              {section.title}
            </div>

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-sidebar-fg/80 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          isActive ? 'text-white' : 'text-sidebar-muted'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          item.badgeColor || 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Prominent Demo Benchmark Callout (Replaces cluttered menu link) */}
      <div className="p-3 border-t border-sidebar-border space-y-3 bg-sidebar-bg">
        <Link
          href="/demo"
          className="group block p-3 rounded-xl bg-primary/10 hover:bg-primary/15 border border-primary/25 transition-all"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono font-bold uppercase text-primary flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>Interactive Demo</span>
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
              17 STEPS
            </span>
          </div>
          <p className="text-[11px] text-sidebar-muted leading-tight group-hover:text-sidebar-fg transition-colors">
            Run the complete $3,000 digital escrow benchmark.
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
            <span>Launch Live Tour</span>
            <ChevronRight className="h-3 w-3" />
          </div>
        </Link>

        {/* Minimal Escrow Proof Status */}
        <div className="flex items-center justify-between px-1 text-[10px] text-sidebar-muted">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>SHA-256 Verified</span>
          </div>
          <span className="font-mono text-[9px] opacity-75">PayPal REST v2</span>
        </div>
      </div>
    </aside>
  );
}
