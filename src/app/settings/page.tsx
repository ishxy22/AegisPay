'use client';

import React, { useState, useEffect } from 'react';
import { Sliders, Key, CheckCircle2, AlertTriangle, ExternalLink, RefreshCw, Zap } from 'lucide-react';

export default function SettingsPage() {
  const [capabilities, setCapabilities] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCapabilities = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setCapabilities(data.capabilities);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCapabilities();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings & Integrations</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Single-file environment configuration. Enter your API credentials into <code className="font-mono text-primary font-bold">.env.local</code> and all features activate automatically.
        </p>
      </div>

      {/* Mode Status Banner */}
      <div
        className={`p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          capabilities?.isDemoMode
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
        }`}
      >
        <div className="flex items-center gap-3">
          {capabilities?.isDemoMode ? (
            <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0" />
          ) : (
            <Zap className="h-6 w-6 text-emerald-600 shrink-0" />
          )}
          <div>
            <h2 className="font-bold text-sm">
              {capabilities?.isDemoMode
                ? 'High-Fidelity Demo / Simulation Mode Active'
                : 'Live External API Integration Mode Active'}
            </h2>
            <p className="text-xs opacity-90 leading-relaxed mt-0.5">
              {capabilities?.isDemoMode
                ? 'All workflows (milestone generation, verification, PDF dossier creation, and PayPal orders) are fully functional using intelligent in-memory heuristics and sandbox mocks.'
                : 'Real PayPal Sandbox APIs, Gemini 2.5 Flash, and Groq Llama 3 models are actively handling live requests.'}
            </p>
          </div>
        </div>

        <button
          onClick={fetchCapabilities}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-current hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Keys</span>
        </button>
      </div>

      {/* Configuration Checklist */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-6">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Key className="h-5 w-5 text-primary" />
          <span>Environment Key Status (.env.local)</span>
        </h2>

        <div className="space-y-4 text-xs">
          {/* PayPal */}
          <div className="p-3.5 rounded-lg border border-border flex items-center justify-between gap-3">
            <div>
              <span className="font-bold text-foreground text-sm block">PayPal Developer Sandbox</span>
              <span className="text-muted-foreground font-mono">
                PAYPAL_CLIENT_ID & PAYPAL_CLIENT_SECRET
              </span>
            </div>
            {capabilities?.hasPayPal ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                Connected
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
                Demo Mock Active
              </span>
            )}
          </div>

          {/* Gemini */}
          <div className="p-3.5 rounded-lg border border-border flex items-center justify-between gap-3">
            <div>
              <span className="font-bold text-foreground text-sm block">Google Gemini 2.5 Flash</span>
              <span className="text-muted-foreground font-mono">GEMINI_API_KEY</span>
            </div>
            {capabilities?.hasGemini ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                Connected
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
                Demo Mock Active
              </span>
            )}
          </div>

          {/* Groq */}
          <div className="p-3.5 rounded-lg border border-border flex items-center justify-between gap-3">
            <div>
              <span className="font-bold text-foreground text-sm block">Groq API (Llama 3 Mediation)</span>
              <span className="text-muted-foreground font-mono">GROQ_API_KEY</span>
            </div>
            {capabilities?.hasGroq ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                Connected
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
                Demo Mock Active
              </span>
            )}
          </div>

          {/* Supabase */}
          <div className="p-3.5 rounded-lg border border-border flex items-center justify-between gap-3">
            <div>
              <span className="font-bold text-foreground text-sm block">Supabase PostgreSQL</span>
              <span className="text-muted-foreground font-mono">NEXT_PUBLIC_SUPABASE_URL</span>
            </div>
            {capabilities?.hasSupabase ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                Connected
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
                In-Memory Store Active
              </span>
            )}
          </div>

          {/* Bryntum */}
          <div className="p-3.5 rounded-lg border border-border flex items-center justify-between gap-3">
            <div>
              <span className="font-bold text-foreground text-sm block">Bryntum Gantt Engine</span>
              <span className="text-muted-foreground font-mono">NEXT_PUBLIC_BRYNTUM_LICENSE_KEY</span>
            </div>
            {capabilities?.hasBryntumLicense ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                Commercial License
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                Interface Mode Active
              </span>
            )}
          </div>
        </div>

        {/* Instructions Box */}
        <div className="p-4 rounded-lg bg-muted/40 border border-border text-xs space-y-2">
          <span className="font-bold text-foreground block">How to activate live external APIs:</span>
          <p className="text-muted-foreground leading-relaxed">
            1. Open <code className="font-mono text-primary">.env.local</code> in the root folder.
            <br />
            2. Paste your keys from PayPal Developer Dashboard, Google AI Studio, and Groq Console.
            <br />
            3. Save the file and refresh this page. AegisPay will automatically switch from Demo Mock to Live external APIs without modifying any code!
          </p>
        </div>
      </div>
    </div>
  );
}
