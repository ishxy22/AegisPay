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
  Sliders,
  PlayCircle,
  Hash,
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects & Milestones', href: '/projects', icon: FolderGit2 },
  { name: 'Digital Verification', href: '/projects/proj_web_dev_3000/verification', icon: FileCheck2 },
  { name: 'Financial Ledger', href: '/transactions', icon: Receipt },
  { name: 'PayPal Invoices', href: '/invoices', icon: FileText },
  { name: 'AI Mediation Center', href: '/mediation', icon: Scale, badge: '1 Active' },
  { name: 'Dispute Defense', href: '/defense', icon: ShieldAlert, badge: 'Action Req', badgeColor: 'bg-rose-500/20 text-rose-300' },
  { name: 'Receipt Verifier', href: '/verify', icon: Hash },
  { name: 'Demo Walkthrough', href: '/demo', icon: PlayCircle, badge: '17 Steps', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings & Integrations', href: '/settings', icon: Sliders },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-sidebar-bg text-sidebar-fg border-r border-sidebar-border hidden md:flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Navigation links */}
      <div className="flex-1 px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-sidebar-muted uppercase">
          Core Engines
        </div>

        {navigationItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-sidebar-fg/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-sidebar-muted'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
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

      {/* Footer Info Box */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="rounded-lg bg-white/5 p-3 text-xs border border-white/5">
          <div className="flex items-center justify-between text-sidebar-muted mb-1.5">
            <span className="font-semibold text-white">Escrow Ledger</span>
            <span className="text-[10px] text-emerald-400 font-mono">APPEND-ONLY</span>
          </div>
          <p className="text-[11px] text-sidebar-muted leading-relaxed">
            All verification reports and receipts are cryptographically sealed with SHA-256.
          </p>
          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-sidebar-muted">
            <span>PayPal Sandbox API</span>
            <span className="text-white flex items-center gap-1 font-mono">v2.0</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
