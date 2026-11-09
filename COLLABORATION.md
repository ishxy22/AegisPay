# AEGISPAY — TEAM COLLABORATION & MERGE GUIDE
**Engineered by Fuzail & Ishita (ActenX Solutions)**

---

## 👥 Division of Responsibilities

### Developer 1: Fuzail
- **Domain:** Backend, APIs, Security, Payments & AI Core.
- **Key Modules:**
  - `src/lib/paypal.ts`: Official PayPal REST API integration (Orders, Captures, Invoices, Refunds, Disputes, Webhook Verification).
  - `src/lib/ai/gemini.ts`: Google Gemini 2.5 Flash milestone generation & multimodal artifact verification.
  - `src/lib/ai/groq.ts`: Groq Llama 3 mediation reasoning & dispute arguments.
  - `src/lib/crypto.ts`: Canonical SHA-256 JSON hashing for append-only proof receipts.
  - `src/lib/pdf/dossier-generator.ts`: `pdf-lib` vector PDF evidence dossier compiler.
  - `src/lib/db.ts` & `supabase/migrations/`: 23 relational database tables, RLS policies, and in-memory persistent store.
  - `src/app/api/`: REST endpoints for payments, AI, verification, mediation, disputes, and webhooks.

### Developer 2: Ishita
- **Domain:** Frontend, UI/UX Design System, Advanced Sponsor Components.
- **Key Modules:**
  - `src/components/AGGridTransactions.tsx`: AG Grid React financial transaction & dispute ledger with custom cell renderers and inspection drawer.
  - `src/components/MilestoneTimelineViewer.tsx`: Bryntum Gantt Integration Interface & interactive schedule visualizer.
  - `src/app/globals.css`: Centralized single CSS styling architecture with semantic color tokens.
  - `src/components/PayPalButtonWrapper.tsx`: Interactive PayPal Sandbox checkout widget.
  - `src/components/Navbar.tsx` & `src/components/Sidebar.tsx`: Enterprise navigation & mode indicator.
  - `src/app/analytics/`: Recharts financial and verification visual analytics.

---

## 🔀 Step-by-Step GitHub Merge Workflow (Zero Merge Conflicts)

### 1. Fuzail's Initial Push
Fuzail pushes the main codebase to GitHub:
```bash
git add .
git commit -m "feat(core): implement AegisPay full-stack architecture, PayPal Sandbox APIs & AI engines"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```
*(Notice: `ishita/` is in `.gitignore`, so Fuzail's push only includes the main source files.)*

### 2. Ishita Clones and Creates Her Feature Branch
Ishita clones Fuzail's repository:
```bash
git clone <your-github-repo-url> aegispay
cd aegispay
git checkout -b feature/ishita-ui-modules
```

### 3. Ishita Places Her Work & Commits Under Her Identity
Ishita pastes the `ishita/` folder (or runs the merge script):
```powershell
# Windows:
.\ishita\MERGE_SCRIPT.ps1

# Linux / Mac:
bash ishita/MERGE_SCRIPT.sh
```

Then Ishita commits with her git identity:
```bash
git add src/components/ src/app/globals.css
git commit --author="Ishita Verma <ishita@actenx.com>" -m "feat(ui): add AG Grid ledger, Bryntum Gantt timeline, and responsive dashboard"
```

### 4. Ishita Pushes & Opens Pull Request
```bash
git push -u origin feature/ishita-ui-modules
```
Open a Pull Request on GitHub:
- **Base:** `main`
- **Compare:** `feature/ishita-ui-modules`
- **Result:** GitHub will merge cleanly with **zero conflicts**, and both Fuzail and Ishita will be recorded as active contributors on the commit timeline!

---

## 🔑 Single Environment File (.env.local)
Put all API keys in `.env.local` in the root folder:
- `PAYPAL_CLIENT_ID` & `PAYPAL_CLIENT_SECRET` (PayPal Sandbox)
- `GEMINI_API_KEY` (Google Gemini 2.5 Flash)
- `GROQ_API_KEY` (Groq Llama 3)
- `NEXT_PUBLIC_SUPABASE_URL` (Supabase PostgreSQL)

If left empty, AegisPay runs seamlessly in **Interactive Demo Mode** with complete local persistence!
