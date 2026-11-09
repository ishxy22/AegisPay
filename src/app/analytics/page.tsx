'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { BarChart3, TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react';

const volumeData = [
  { month: 'Jul', volume: 1800, captured: 1800 },
  { month: 'Aug', volume: 2400, captured: 2200 },
  { month: 'Sep', volume: 3100, captured: 3100 },
  { month: 'Oct', volume: 3800, captured: 3500 },
  { month: 'Nov', volume: 4500, captured: 4250 },
];

const criteriaStatusData = [
  { name: 'Fully Passed', value: 70, color: '#10B981' },
  { name: 'Partially Verified', value: 20, color: '#0062FF' },
  { name: 'Failed / Disputed', value: 10, color: '#EF4444' },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Operational & Financial Analytics</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Real-time metrics tracking digital delivery verification accuracy, dispute defense rate, and PayPal volume.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[11px] text-muted-foreground uppercase font-semibold">Total Escrow Volume</span>
          <div className="text-xl font-bold text-foreground">$15,600.00</div>
          <span className="text-[11px] text-emerald-600 font-medium">+24% vs last month</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[11px] text-muted-foreground uppercase font-semibold">Verification Pass Rate</span>
          <div className="text-xl font-bold text-emerald-600">92.4%</div>
          <span className="text-[11px] text-muted-foreground">Automated & visual tests</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[11px] text-muted-foreground uppercase font-semibold">Mediation Resolution</span>
          <div className="text-xl font-bold text-blue-600">88.0%</div>
          <span className="text-[11px] text-muted-foreground">Pre-dispute compromises</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[11px] text-muted-foreground uppercase font-semibold">Avg. Dossier Compile Time</span>
          <div className="text-xl font-bold text-foreground">1.8s</div>
          <span className="text-[11px] text-muted-foreground">Vector PDF generation</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Contract & Payment Volume */}
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-foreground">Escrow & Captured Payment Volume (USD)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="volume" fill="#0062FF" radius={[4, 4, 0, 0]} name="Contract Value" />
                <Bar dataKey="captured" fill="#10B981" radius={[4, 4, 0, 0]} name="Captured" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Verification Breakdown */}
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-foreground">Acceptance Criteria Verification Health</h2>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={criteriaStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {criteriaStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs">
            {criteriaStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
