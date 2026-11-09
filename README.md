# AEGISPAY — AI-Powered B2B Fintech & Digital Commerce Protection

> **"Every payment should have proof. Every deliverable should have protection."**

AegisPay is an enterprise-grade payment protection and chargeback defense platform built for digital service transactions (freelancers, software developers, agencies, and SaaS clients).

---

## 🌟 The Problem AegisPay Solves

Physical commerce relies on postal tracking numbers and delivery signatures. Digital work has code commits, pull requests, deployment links, design files, revision histories, and acceptance criteria.

AegisPay turns these digital artifacts into **structured, timestamped, and cryptographically verifiable fulfillment records** (SHA-256 canonical receipts) that defend transactions in pre-dispute mediation and formal PayPal chargeback arbitration.

---

## 🏗️ The Four Connected Engines

### 1. Engine A — Smart Milestone Engine
- Parses natural-language briefs into 3+ structured, editable milestones.
- Generates deliverables, acceptance criteria, budget allocations, and dependencies.
- Synchronizes with official PayPal Sandbox orders, approvals, captures, and invoices.
- Maintains an internal milestone allocation and release ledger.

### 2. Engine B — AI Digital Fulfillment Inspector
- Ingests GitHub PR URLs, commit SHAs, live staging URLs, screenshots, and completion notes.
- Deterministically verifies code builds, runs automated tests, probes endpoint status codes (HTTP 200), and analyzes visual fidelity via Gemini Vision.
- Issues an append-only, tamper-evident **Digital Proof-of-Work Receipt (SHA-256 canonical hash)**.

### 3. Engine C — AI Mediation Engine (Groq Llama 3)
- Resolves disagreements before formal payment arbitration.
- Computes fair compromise settlement proposals (e.g., 75% verified completion $\to$ 20% partial refund compromise).
- Enables mutual signoff and automatically executes authorized PayPal Sandbox refunds.

### 4. Engine D — Autonomous Dispute Defense Engine
- Webhook listener receives real-time dispute notifications (`CUSTOMER.DISPUTE.CREATED`).
- Verifies webhook authenticity with PayPal's cryptographic signature verification API.
- Compiles the official branded **"AEGISPAY — DIGITAL FULFILLMENT EVIDENCE DOSSIER"** vector PDF via `pdf-lib`.
- Submits evidence directly to the PayPal Customer Disputes API.

---

## 🚀 Quick Start Guide

### 1. Clone & Install
```bash
git clone <repo-url> aegispay
cd aegispay
npm install --legacy-peer-deps
```

### 2. Configure Environment Keys
AegisPay uses a **single `.env.local` file** for all credentials.
Simply open `.env.local` and paste your keys:

```env
# PayPal Sandbox
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_WEBHOOK_ID=your_webhook_id
PAYPAL_ENVIRONMENT=sandbox

# AI Providers
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key

# Supabase (Optional: in-memory store active if unset)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

> **Zero-Setup Demo Mode:** If any API key is missing, AegisPay runs seamlessly in **Interactive Demo Mode** with complete local persistence and realistic sandbox simulators. You can test the entire lifecycle out-of-the-box!

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📊 Benchmark Demonstration Scenario

A pre-populated benchmark project is loaded by default:
- **Project:** FinTech Platform Redesign & API Integration ($3,000 USD)
- **Milestone 1:** UI/UX Architecture ($750) — *Captured & Verified*
- **Milestone 2:** Frontend Client Dashboard ($1,250) — *75% Verified, Dispute PP-D-88219402 active, Mediation pending*
- **Milestone 3:** Backend Integration ($1,000) — *Payment Requested*

Click **"Load Demo Scenario"** in the top navigation bar anytime to reset the state.

---

## 🛡️ Security & Integrity

- **Cryptographic Receipts:** Canonical JSON sorted recursively and hashed with SHA-256.
- **Append-Only Database:** 23 PostgreSQL relational tables with Supabase RLS.
- **Strict PayPal Compliance:** Real API endpoints (`/v2/checkout/orders`, `/v1/customer/disputes`, `/v2/payments/captures/{id}/refund`), zero hardcoded secrets.
