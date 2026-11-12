'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Zap,
  Lock,
  GitPullRequest,
  CheckCircle2,
  FileText,
  Scale,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Code2,
  FileCheck,
  ShieldAlert,
  ArrowUpRight,
  Layers,
  Terminal,
  Play,
  Check,
  X,
  CreditCard,
  Hash,
  Sparkles,
} from 'lucide-react';

export default function LandingPage() {
  const [activeStage, setActiveStage] = useState<'funded' | 'audited' | 'sealed' | 'defended'>('sealed');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* 1. Public Top Navigation Bar (Full-Width, Dedicated for Landing Page) */}
      <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-foreground">AegisPay</span>
                <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                  ESCROW
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground hidden sm:block">Digital Commerce Payment Protection</p>
            </div>
          </Link>

          {/* Center Smooth-Scroll Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
            <button
              onClick={() => scrollToSection('simulator')}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Live Simulator
            </button>
            <button
              onClick={() => scrollToSection('problem')}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              The Reality Check
            </button>
            <button
              onClick={() => scrollToSection('engines')}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              The 4 Engines
            </button>
            <button
              onClick={() => scrollToSection('dossier')}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Evidence Dossier
            </button>
            <Link href="/demo" className="hover:text-foreground transition-colors flex items-center gap-1">
              <span>17-Step Demo</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 font-bold">LIVE</span>
            </Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm transition-all"
            >
              <span>Command Center</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 space-y-24 py-12 sm:py-20">
        {/* 2. Hero Section */}
        <section className="text-center max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-Generation B2B Payment Defense for Digital Work</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
            Physical goods have tracking numbers.{' '}
            <span className="text-primary block sm:inline">Digital services now have AegisPay.</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            When software deliverables are disputed on PayPal, sellers lose because payment processors demand postal tracking slips. AegisPay continuously anchors code commits, PRs, and live deployment tests into tamper-evident, SHA-256 sealed fulfillment records that protect payments and win chargeback arbitration.
          </p>

          {/* Smooth-Scroll Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
            <button
              onClick={() => scrollToSection('simulator')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary-hover shadow-md hover:shadow-lg transition-all group cursor-pointer"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Explore Live Simulator</span>
              <ChevronDown className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
            </button>

            <button
              onClick={() => scrollToSection('problem')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold border border-border bg-card hover:bg-muted text-foreground transition-all cursor-pointer"
            >
              <span>See The Reality Check</span>
            </button>

            <button
              onClick={() => scrollToSection('engines')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <Layers className="h-4 w-4 text-primary" />
              <span>How The 4 Engines Work</span>
            </button>
          </div>

          {/* Capabilities Pill Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-8 border-t border-border/60 max-w-3xl mx-auto text-left">
            <div className="p-3.5 rounded-xl border border-border bg-card">
              <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground block">
                Payment Rails
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-sm text-foreground">PayPal Sandbox</span>
              </div>
              <span className="text-[11px] text-muted-foreground mt-0.5 block">REST v2 Orders & Disputes</span>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-card">
              <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground block">
                Cryptographic Proof
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="font-bold text-sm text-foreground">SHA-256 Sealed</span>
              </div>
              <span className="text-[11px] text-muted-foreground mt-0.5 block">RFC 8785 Canonicalization</span>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-card">
              <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground block">
                AI Auditing
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="h-2 w-2 rounded-full bg-cyan-500" />
                <span className="font-bold text-sm text-foreground">Gemini 2.5 Flash</span>
              </div>
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Multimodal PR & Healthchecks</span>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-card">
              <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground block">
                Pre-Dispute Mediation
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="font-bold text-sm text-foreground">Groq Llama 3</span>
              </div>
              <span className="text-[11px] text-muted-foreground mt-0.5 block">Autonomous Settlement Engine</span>
            </div>
          </div>
        </section>

        {/* 3. The Interactive "Stop-Scrolling" Contract Lifecycle Simulator */}
        <section id="simulator" className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6 scroll-mt-24">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-mono font-bold uppercase text-primary tracking-wider">
              Interactive Proof Simulator
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              See How AegisPay Defends a $3,000 Software Contract
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              Click each phase below to see how digital deliverables transform into an ironclad defense record.
            </p>
          </div>

          {/* Simulator Box */}
          <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
            {/* Stage Selector Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 border-b border-border bg-muted/30">
              <button
                onClick={() => setActiveStage('funded')}
                className={`p-3.5 text-left transition-all border-r border-border last:border-r-0 ${
                  activeStage === 'funded'
                    ? 'bg-card border-b-2 border-b-primary shadow-xs'
                    : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <span className="text-[10px] font-mono uppercase font-bold text-primary block">Phase 1</span>
                <span className="text-xs font-bold text-foreground block mt-0.5">Escrow Funded</span>
              </button>

              <button
                onClick={() => setActiveStage('audited')}
                className={`p-3.5 text-left transition-all border-r border-border last:border-r-0 ${
                  activeStage === 'audited'
                    ? 'bg-card border-b-2 border-b-emerald-500 shadow-xs'
                    : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-600 block">Phase 2</span>
                <span className="text-xs font-bold text-foreground block mt-0.5">Deliverable Audited</span>
              </button>

              <button
                onClick={() => setActiveStage('sealed')}
                className={`p-3.5 text-left transition-all border-r border-border last:border-r-0 ${
                  activeStage === 'sealed'
                    ? 'bg-card border-b-2 border-b-cyan-500 shadow-xs'
                    : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <span className="text-[10px] font-mono uppercase font-bold text-cyan-600 block">Phase 3</span>
                <span className="text-xs font-bold text-foreground block mt-0.5">SHA-256 Sealed</span>
              </button>

              <button
                onClick={() => setActiveStage('defended')}
                className={`p-3.5 text-left transition-all ${
                  activeStage === 'defended'
                    ? 'bg-card border-b-2 border-b-rose-500 shadow-xs'
                    : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <span className="text-[10px] font-mono uppercase font-bold text-rose-600 block">Phase 4</span>
                <span className="text-xs font-bold text-foreground block mt-0.5">Dispute Defended</span>
              </button>
            </div>

            {/* Stage Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {activeStage === 'funded' && (
                <div className="space-y-4 animate-in fade-in-50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                    <div>
                      <span className="text-xs font-bold text-primary uppercase font-mono">Engine A: Milestone Order</span>
                      <h3 className="text-lg font-bold text-foreground">Milestone 1: UI/UX Prototype ($750 USD)</h3>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>PayPal Order: PAYPAL_ORDER_9X882</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-1.5">
                      <span className="text-muted-foreground block font-bold">CLIENT BUYER:</span>
                      <p className="text-foreground">NovaTech Enterprises (finance@novatech.io)</p>
                      <span className="text-muted-foreground block font-bold pt-2">ESCROW ALLOCATION:</span>
                      <p className="text-foreground font-bold text-emerald-600">$750.00 USD (Captured via PayPal Sandbox)</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-1.5">
                      <span className="text-muted-foreground block font-bold">AGREED ACCEPTANCE CRITERIA:</span>
                      <p className="text-foreground">1. Figma responsive token specifications</p>
                      <p className="text-foreground">2. Clickable userflow prototype delivered</p>
                      <p className="text-foreground">3. OpenAPI contract schema verified</p>
                    </div>
                  </div>
                </div>
              )}

              {activeStage === 'audited' && (
                <div className="space-y-4 animate-in fade-in-50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                    <div>
                      <span className="text-xs font-bold text-emerald-600 uppercase font-mono">Engine B: Multimodal Inspection</span>
                      <h3 className="text-lg font-bold text-foreground">GitHub PR #14 & Staging Live Audit</h3>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Criteria: 3 Passed / 0 Failed (HTTP 200 OK)</span>
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-xs border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
                      <span>AUDIT PROBE RESULTS</span>
                      <span className="text-emerald-400">LATENCY: 38ms</span>
                    </div>
                    <p className="text-zinc-300">GET https://staging.aegispay.dev/preview/m1 ➔ HTTP/2 200 OK</p>
                    <p className="text-zinc-300">GitHub Commit SHA: 7b4cf288e219ba38029a1b417c80d46fe52 (PR #14 Merged)</p>
                    <p className="text-zinc-300">TypeScript Type Check: Zero declaration errors across 39 files</p>
                  </div>
                </div>
              )}

              {activeStage === 'sealed' && (
                <div className="space-y-4 animate-in fade-in-50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                    <div>
                      <span className="text-xs font-bold text-cyan-600 uppercase font-mono">Engine B: Cryptographic Seal</span>
                      <h3 className="text-lg font-bold text-foreground">Append-Only SHA-256 Receipt Generated</h3>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 border border-cyan-500/20">
                      <Lock className="h-3.5 w-3.5" />
                      <span>Tamper-Evident Canonical Hash</span>
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
                    <span className="text-xs font-bold text-muted-foreground block font-mono">
                      CANONICAL SHA-256 INTEGRITY SEAL:
                    </span>
                    <div className="p-3 rounded-lg bg-background border border-border font-mono text-xs text-primary font-bold break-all">
                      4a3b83648c66e949666e5f03d52cb37851d7b3287042a969b828fc8a0a99c72e
                    </div>
                    <span className="text-[11px] text-muted-foreground block">
                      Anchored in Supabase PostgreSQL table <code className="text-foreground">proof_receipts</code>. Any alteration of a single character in the project record invalidates this seal.
                    </span>
                  </div>
                </div>
              )}

              {activeStage === 'defended' && (
                <div className="space-y-4 animate-in fade-in-50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                    <div>
                      <span className="text-xs font-bold text-rose-600 uppercase font-mono">Engine D: PayPal Dispute Defense</span>
                      <h3 className="text-lg font-bold text-foreground">Evidence Dossier Compiled & Submitted via API</h3>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      <span>Dispute Case: PP-D-88219402</span>
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1.5">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Evidence Package Successfully Acknowledged by PayPal Customer Disputes API</span>
                    </span>
                    <p className="text-muted-foreground">
                      AegisPay submitted the 2-page vector evidence dossier containing git commit diffs, live HTTP healthchecks, and the SHA-256 cryptographic seal. The case is actively synchronized as "Evidence Submitted / Awaiting Adjudication".
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 4. The Reality Check: Nightmare vs AegisPay */}
        <section id="problem" className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6 scroll-mt-24">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-mono font-bold uppercase text-primary tracking-wider">
              The Reality Check
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Why Freelance Software Projects Get Disputed & Lost
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              Traditional payment gateways treat software like shoes. Here is the difference AegisPay makes:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Old Way */}
            <div className="p-6 rounded-2xl border border-rose-500/30 bg-rose-500/5 space-y-4">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <X className="h-5 w-5" />
                <span>Traditional Payment Gateways (The Trap)</span>
              </div>
              <ul className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Scope is discussed informally on Slack, WhatsApp, or email without verifiable acceptance criteria.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Client files a PayPal chargeback: <em>"Service not received / Significantly not as described"</em>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>PayPal asks for a physical shipping tracking number. Software developers have no postal slips.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Developer submits raw screenshots; automated bots reject them. 100% of funds reversed plus chargeback penalty fees.</span>
                </li>
              </ul>
            </div>

            {/* The AegisPay Way */}
            <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <Check className="h-5 w-5" />
                <span>With AegisPay (The Cryptographic Shield)</span>
              </div>
              <ul className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Natural-language briefs are broken down by Gemini AI into structured milestones and acceptance criteria.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Funds are captured on PayPal Sandbox Orders and recorded in an immutable append-only escrow ledger.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Deliverables (PRs, commit SHAs, staging healthchecks) are audited by AI and sealed with SHA-256 hashes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>If a dispute occurs, AegisPay compiles and transmits a court-ready 2-page evidence dossier directly to PayPal API in seconds.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 5. The Four Intelligent Connected Engines */}
        <section id="engines" className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6 scroll-mt-24">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-mono font-bold uppercase text-primary tracking-wider">
              System Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Four Connected Intelligent Engines
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              Autonomous protection guarding the entire digital services contract lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Engine A */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-3 hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-sm">
                    A
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">Smart Milestone Escrow</h3>
                    <span className="text-[10px] font-mono text-muted-foreground">Planning & PayPal Sync</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 font-semibold">
                  Gemini 2.5 Flash
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Transforms natural-language project briefs into structured, verifiable milestone plans with budget allocations, deliverables, and acceptance criteria. Generates synchronized PayPal Orders tracked in an immutable ledger.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-semibold">
                <Link href="/projects/new" className="text-primary hover:underline inline-flex items-center gap-1">
                  <span>Create Milestone Plan</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
                <Link href="/projects" className="text-muted-foreground hover:text-foreground">
                  View Escrow Ledger →
                </Link>
              </div>
            </div>

            {/* Engine B */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-3 hover:border-emerald-500/50 transition-all">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    B
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">Digital Fulfillment Inspector</h3>
                    <span className="text-[10px] font-mono text-muted-foreground">Automated Auditing & Cryptography</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-semibold">
                  SHA-256 Proof Seals
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Audits GitHub PRs, commit diffs, staging endpoints, and UI screenshots against agreed acceptance criteria. Produces RFC 8785 canonical JSON records stamped with cryptographic SHA-256 hashes permanently stored in PostgreSQL.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-semibold">
                <Link href="/projects/proj_web_dev_3000/verification" className="text-emerald-600 hover:underline inline-flex items-center gap-1">
                  <span>Run Fulfillment Inspector</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
                <Link href="/verify" className="text-muted-foreground hover:text-foreground">
                  Verify Receipt Hash →
                </Link>
              </div>
            </div>

            {/* Engine C */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-3 hover:border-amber-500/50 transition-all">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-sm">
                    C
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">Commercial Mediation Engine</h3>
                    <span className="text-[10px] font-mono text-muted-foreground">Pre-Dispute Compromise</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 font-semibold">
                  Groq Llama 3
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Proactively resolves partial fulfillment disagreements before payment disputes occur. Evaluates completion ratios and generates data-backed compromise settlements. Once accepted by both parties, executes authorized PayPal Sandbox refunds.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-semibold">
                <Link href="/mediation" className="text-amber-600 hover:underline inline-flex items-center gap-1">
                  <span>Explore Mediation Center</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
                <span className="text-muted-foreground text-[11px]">1 Active Case Ready</span>
              </div>
            </div>

            {/* Engine D */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-3 hover:border-rose-500/50 transition-all">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold text-sm">
                    D
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">Dispute Defense Command Center</h3>
                    <span className="text-[10px] font-mono text-muted-foreground">Webhooks & Dossier Compiler</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 font-semibold">
                  Customer Disputes API
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ingests live PayPal dispute webhooks, correlates claims against cryptographic fulfillment records, and compiles a vector PDF evidence dossier. Transmits evidence through the PayPal Disputes API and truthfully synchronizes adjudication status.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-semibold">
                <Link href="/defense" className="text-rose-600 hover:underline inline-flex items-center gap-1">
                  <span>Access Defense Center</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
                <a
                  href="/api/dossier/disp_sandbox_8821"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Download PDF Dossier →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Verifiable Evidence Dossier Showcase */}
        <section id="dossier" className="max-w-5xl mx-auto px-4 sm:px-6 scroll-mt-24">
          <div className="p-8 sm:p-10 rounded-3xl bg-zinc-950 text-white border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                <Lock className="h-3.5 w-3.5" />
                <span>Court-Ready Cryptographic Evidence</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Branded Vector PDF Evidence Dossier
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Every deliverable receipt, git commit diff, live healthcheck result, and milestone specification is compiled into a multi-page vector PDF with an embedded SHA-256 seal formatted specifically for PayPal dispute claims.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <a
                href="/api/dossier/disp_sandbox_8821"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary-hover shadow-md transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span>Download Sample Dossier PDF</span>
              </a>

              <Link
                href="/demo"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 transition-colors"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Run in 17-Step Demo</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 7. Bottom Call to Action */}
        <section className="text-center max-w-2xl mx-auto px-4 py-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Stop losing digital service chargebacks.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
            Experience autonomous payment protection and cryptographic escrow defense in action.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => scrollToSection('simulator')}
              className="px-6 py-3 rounded-xl text-xs font-bold border border-border bg-card hover:bg-muted text-foreground transition-all cursor-pointer"
            >
              Test Live Simulator ↑
            </button>
            <Link
              href="/demo"
              className="px-6 py-3 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm transition-all"
            >
              Launch 17-Step Demo Runner →
            </Link>
          </div>
        </section>
      </main>

      {/* 8. Public Footer */}
      <footer className="border-t border-border py-8 bg-card/40 text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="font-bold text-foreground">AegisPay</span>
            <span>— Built by ActenX Solutions (Ishita & Fuzail)</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Command Center
            </Link>
            <Link href="/demo" className="hover:text-foreground transition-colors">
              Benchmark Demo
            </Link>
            <Link href="/verify" className="hover:text-foreground transition-colors">
              Receipt Verifier
            </Link>
            <a
              href="https://github.com/actenx/aegispay"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
