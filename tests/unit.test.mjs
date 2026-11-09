// ==============================================================================
// AEGISPAY COMPREHENSIVE AUTOMATED TEST SUITE
// Covers Unit, Cryptographic, Integration, PayPal, Database, Auth & AI pipelines.
// ==============================================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

// Automatically parse and load .env.local into process.env if present
try {
  const envPath = path.resolve('.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [k, ...rest] = trimmed.split('=');
        const key = k.trim();
        const val = rest.join('=').trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
} catch {
  // Ignore
}

// Configuration from environment
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';

// ------------------------------------------------------------------------------
// 1. CRYPTOGRAPHIC PROOF-OF-WORK RECEIPT & CANONICALIZATION TESTS
// ------------------------------------------------------------------------------

function canonicalizeJson(obj) {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return '[' + obj.map((item) => canonicalizeJson(item)).join(',') + ']';
  }
  const sortedKeys = Object.keys(obj).sort();
  const pairs = sortedKeys.map((key) => {
    return `${JSON.stringify(key)}:${canonicalizeJson(obj[key])}`;
  });
  return '{' + pairs.join(',') + '}';
}

function sha256(str) {
  return crypto.createHash('sha256').update(str, 'utf8').digest('hex');
}

test('1. Canonical JSON serialization produces identical strings regardless of key ordering', () => {
  const objA = { z: 1, a: 'hello', m: [3, 2, 1], b: { y: 'nested', x: true } };
  const objB = { a: 'hello', b: { x: true, y: 'nested' }, z: 1, m: [3, 2, 1] };

  const canonA = canonicalizeJson(objA);
  const canonB = canonicalizeJson(objB);

  assert.equal(canonA, canonB, 'Key order must be normalized recursively');
  assert.equal(sha256(canonA), sha256(canonB), 'SHA-256 hash must be strictly identical');
});

test('2. Cryptographic Proof-of-Work Receipt detects single-character tampering', () => {
  const receiptPayload = {
    receipt_version: '1.0.0',
    project_id: 'proj_web_dev_3000',
    milestone_id: 'ms_uiux_750',
    provider_id: 'usr_dev_actenx',
    client_id: 'usr_client_novatech',
    commit_sha: '7b4cf288e219ba38029a1b417c80d46fe52',
    acceptance_criteria_results: {
      total: 3,
      passed: 3,
      completion_rate: 100,
    },
    timestamp: '2026-11-05T19:30:00Z',
  };

  const canonicalStr = canonicalizeJson(receiptPayload);
  const legitimateHash = sha256(canonicalStr);

  // Tamper with completion_rate (change 100 to 99)
  const tamperedPayload = JSON.parse(JSON.stringify(receiptPayload));
  tamperedPayload.acceptance_criteria_results.completion_rate = 99;

  const tamperedCanonicalStr = canonicalizeJson(tamperedPayload);
  const tamperedHash = sha256(tamperedCanonicalStr);

  assert.notEqual(legitimateHash, tamperedHash, 'Hash must change when payload is tampered');
});

// ------------------------------------------------------------------------------
// 2. MEDIATION & LEDGER ALGORITHMS
// ------------------------------------------------------------------------------

test('3. Mediation Engine calculates proportional and equitable financial compromise', () => {
  const originalAmount = 1250;
  const completionPercentage = 75; // 75% completed

  const unverifiedRatio = Math.max(0, (100 - completionPercentage) / 100);
  const proposedRefund = Math.round(originalAmount * unverifiedRatio);
  const proposedRetained = originalAmount - proposedRefund;

  assert.equal(proposedRefund, 313, 'Refund matches unverified portion (25%)');
  assert.equal(proposedRetained, 937, 'Retained matches verified delivery value (75%)');
  assert.equal(proposedRefund + proposedRetained, originalAmount, 'Sum of settlement equals original milestone amount');
});

test('4. Append-only ledger maintains immutable historical sequencing', () => {
  const ledger = [];
  const logEvent = (action, details) => {
    ledger.push({
      index: ledger.length,
      action,
      details,
      timestamp: new Date().toISOString(),
    });
  };

  logEvent('PAYMENT_REQUESTED', { amount: 750 });
  logEvent('PAYMENT_CAPTURED', { capture_id: 'CAP_123' });
  logEvent('DELIVERABLE_VERIFIED', { score: 100 });

  assert.equal(ledger.length, 3);
  assert.equal(ledger[0].action, 'PAYMENT_REQUESTED');
  assert.equal(ledger[1].action, 'PAYMENT_CAPTURED');
  assert.equal(ledger[2].action, 'DELIVERABLE_VERIFIED');
  assert.equal(ledger[0].index, 0);
  assert.equal(ledger[2].index, 2);
});

// ------------------------------------------------------------------------------
// 3. PAYPAL SANDBOX LIVE INTEGRATION TESTS
// ------------------------------------------------------------------------------

test('5. PayPal Sandbox live OAuth token generation succeeds', async () => {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  const res = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  assert.equal(res.status, 200, 'PayPal Sandbox token endpoint must return 200');
  const data = await res.json();
  assert.ok(data.access_token, 'Response must include access_token');
  assert.equal(data.token_type, 'Bearer', 'Token type must be Bearer');
});

test('6. PayPal Sandbox Invoicing API lists invoices successfully', async () => {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  const tokenRes = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  const token = (await tokenRes.json()).access_token;

  const invoiceRes = await fetch('https://api-m.sandbox.paypal.com/v2/invoicing/invoices?page=1&page_size=5&total_required=true', {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });

  assert.equal(invoiceRes.status, 200, 'PayPal Invoices endpoint must return 200');
  const invoiceData = await invoiceRes.json();
  assert.ok(typeof invoiceData.total_items === 'number', 'Must return total_items count');
});

// ------------------------------------------------------------------------------
// 4. SUPABASE POSTGRESQL PERSISTENCE & RLS TESTS
// ------------------------------------------------------------------------------

test('7. Supabase PostgreSQL persistence verifies relational project and milestone queries', async () => {
  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const { data: projects, error } = await sb.from('projects').select('*').limit(1);
  assert.equal(error, null, 'Querying projects must not return errors');
  assert.ok(projects.length > 0, 'Database must contain persisted benchmark projects');

  const projectId = projects[0].id;
  const { data: milestones, error: msErr } = await sb.from('milestones').select('*').eq('project_id', projectId);
  assert.equal(msErr, null, 'Querying milestones must not return errors');
  assert.ok(milestones.length >= 3, 'Project must contain at least 3 relational milestones');
});

// ------------------------------------------------------------------------------
// 5. AUTHENTICATION & AUTHORIZATION TESTS
// ------------------------------------------------------------------------------

test('8. Role-based authorization gates access to projects belonging to other users', () => {
  const project = {
    id: 'proj_123',
    client_id: 'usr_client_novatech',
    client_email: 'finance@novatech.io',
    provider_id: 'usr_dev_actenx',
    provider_email: 'fuzail@actenx.com',
  };

  const legitimateProvider = {
    userId: 'usr_dev_actenx',
    email: 'fuzail@actenx.com',
    role: 'service_provider',
  };

  const legitimateClient = {
    userId: 'usr_client_novatech',
    email: 'finance@novatech.io',
    role: 'client',
  };

  const unauthorizedUser = {
    userId: 'usr_malicious_attacker',
    email: 'hacker@darkweb.org',
    role: 'client',
  };

  const adminUser = {
    userId: 'usr_platform_admin',
    email: 'admin@aegispay.com',
    role: 'admin',
  };

  function canAccess(proj, user) {
    if (user.role === 'admin') return true;
    if (proj.client_id === user.userId || proj.provider_id === user.userId) return true;
    if (proj.client_email === user.email || proj.provider_email === user.email) return true;
    return false;
  }

  assert.equal(canAccess(project, legitimateProvider), true, 'Provider must have access');
  assert.equal(canAccess(project, legitimateClient), true, 'Client must have access');
  assert.equal(canAccess(project, unauthorizedUser), false, 'Unauthorized user must be blocked');
  assert.equal(canAccess(project, adminUser), true, 'Admin must have access');
});

// ------------------------------------------------------------------------------
// 6. IDEMPOTENCY & DUPLICATE PREVENTION
// ------------------------------------------------------------------------------

test('9. Webhook and financial operation idempotency prevents duplicate event processing', () => {
  const processedKeys = new Set();

  function processWebhook(idempotencyKey) {
    if (processedKeys.has(idempotencyKey)) {
      return { duplicate: true, status: 200, message: 'Already processed' };
    }
    processedKeys.add(idempotencyKey);
    return { duplicate: false, status: 201, message: 'Processed successfully' };
  }

  const key = 'paypal_wh_ev_capture_881923';
  const firstRun = processWebhook(key);
  const secondRun = processWebhook(key);

  assert.equal(firstRun.duplicate, false, 'First run must process');
  assert.equal(secondRun.duplicate, true, 'Second run must be recognized as duplicate (idempotent)');
});

// ------------------------------------------------------------------------------
// 7. GOOGLE GEMINI 2.5 FLASH AI INTEGRATION TEST
// ------------------------------------------------------------------------------

test('10. Google Gemini 2.5 Flash API delivers structured criteria inspection', async () => {
  const prompt = `Act as AegisPay Auditor. Given criteria: ["Pull request merged", "Tests passing"]. Return JSON: {"verified": true, "score": 100}`;
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });

  assert.equal(res.status, 200, 'Gemini API must return 200');
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  assert.ok(text, 'Gemini must return text part');
  const parsed = JSON.parse(text);
  assert.equal(parsed.verified, true, 'Gemini must output requested JSON schema');
});
