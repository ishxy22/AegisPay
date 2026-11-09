'use client';

import React, { useState } from 'react';
import { ShieldCheck, Hash, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';

const sampleValidReceipt = {
  receipt_version: "1.0.0",
  project_id: "proj_web_dev_3000",
  milestone_id: "ms_uiux_750",
  provider_id: "usr_dev_actenx",
  client_id: "usr_client_novatech",
  commit_sha: "7b4cf288e219ba38029a1b417c80d46fe52",
  pull_request_ref: "https://github.com/actenx/aegispay/pull/14",
  deployment_url: "https://aegispay-preview.vercel.app",
  test_results_summary: "3 passed, 1 partial, 0 failed",
  acceptance_criteria_results: {
    total: 3,
    passed: 3,
    completion_rate: 100
  },
  verification_report_id: "rep_uiux_750_verified",
  timestamp: "2026-11-05T19:30:00.000Z",
  disclaimer: "AegisPay Cryptographic Proof-of-Work Receipt. Not a physical carrier tracking number.",
  content_sha256: "9f835f1109264745602fed5ed6342f093d35b42d00c67b1b590a82e6a1413173"
};

// Deterministic canonical serializer for client-side testing
function canonicalizeJson(obj: unknown): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return '[' + obj.map((item) => canonicalizeJson(item)).join(',') + ']';
  }
  const sortedKeys = Object.keys(obj as Record<string, unknown>).sort();
  const pairs = sortedKeys.map((key) => {
    const val = (obj as Record<string, unknown>)[key];
    return `${JSON.stringify(key)}:${canonicalizeJson(val)}`;
  });
  return '{' + pairs.join(',') + '}';
}

// Client-side SHA-256 implementation using SubtleCrypto
async function computeSha256(str: string): Promise<string> {
  const buf = new TextEncoder().encode(str);
  const hashBuf = await crypto.subtle.digest('SHA-256', buf);
  const hashArr = Array.from(new Uint8Array(hashBuf));
  return hashArr.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function ReceiptVerifierPage() {
  const [inputJson, setInputJson] = useState(JSON.stringify(sampleValidReceipt, null, 2));
  const [result, setResult] = useState<{
    valid: boolean;
    computedHash: string;
    expectedHash: string;
    canonicalPayload: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    setError(null);
    try {
      const parsed = JSON.parse(inputJson);
      const expectedHash = parsed.content_sha256;

      // Extract payload minus hash
      const payloadWithoutHash = { ...parsed };
      delete payloadWithoutHash.content_sha256;

      const canonicalStr = canonicalizeJson(payloadWithoutHash);
      const computedHash = await computeSha256(canonicalStr);

      setResult({
        valid: computedHash === expectedHash,
        computedHash,
        expectedHash: expectedHash || 'None provided in JSON',
        canonicalPayload: canonicalStr,
      });
    } catch (err: any) {
      setError(err.message || 'Invalid JSON format');
    }
  };

  const handleTamperTest = () => {
    try {
      const parsed = JSON.parse(inputJson);
      // Introduce subtle tamper in completion_rate or commit
      parsed.acceptance_criteria_results.completion_rate = 99;
      setInputJson(JSON.stringify(parsed, null, 2));
      setResult(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleResetValid = () => {
    setInputJson(JSON.stringify(sampleValidReceipt, null, 2));
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cryptographic Receipt Verifier</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Independent tamper-evident verification engine. Validates canonical JSON ordering and SHA-256 integrity seals.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 text-rose-600 border border-rose-500/20 text-xs">
          {error}
        </div>
      )}

      {/* Editor & Actions */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Hash className="h-4 w-4 text-primary" />
            <span>Proof-of-Work Receipt JSON Payload</span>
          </label>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTamperTest}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-amber-500/30 text-amber-600 hover:bg-amber-500/10 transition-colors"
            >
              Simulate 1-Bit Data Tamper
            </button>
            <button
              onClick={handleResetValid}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-border hover:bg-muted text-foreground transition-colors"
            >
              Reset to Valid Receipt
            </button>
          </div>
        </div>

        <textarea
          rows={12}
          value={inputJson}
          onChange={(e) => setInputJson(e.target.value)}
          className="w-full p-3.5 rounded-lg border border-border bg-background text-foreground font-mono text-xs focus:ring-1 focus:ring-primary outline-none leading-relaxed"
        />

        <button
          onClick={handleVerify}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm transition-colors"
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Verify Cryptographic Integrity</span>
        </button>
      </div>

      {/* Results Box */}
      {result && (
        <div
          className={`p-6 rounded-xl border shadow-sm space-y-4 animate-in fade-in-50 ${
            result.valid
              ? 'border-emerald-500/30 bg-emerald-500/5'
              : 'border-rose-500/30 bg-rose-500/5'
          }`}
        >
          <div className="flex items-center gap-2">
            {result.valid ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-emerald-600 text-sm">Receipt Cryptographically Verified</h3>
                  <p className="text-xs text-muted-foreground">
                    Canonical SHA-256 checksum matches the tamper seal exactly. Deliverables have not been altered.
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle className="h-6 w-6 text-rose-600" />
                <div>
                  <h3 className="font-bold text-rose-600 text-sm">Tamper Detected! Checksum Mismatch</h3>
                  <p className="text-xs text-muted-foreground">
                    The content was modified after issuance. The computed hash does not match the sealed hash.
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <span className="font-semibold text-foreground block mb-1">Expected Sealed Hash:</span>
              <div className="p-2.5 rounded-lg bg-background border border-border font-mono text-[11px] break-all text-muted-foreground">
                {result.expectedHash}
              </div>
            </div>

            <div>
              <span className="font-semibold text-foreground block mb-1">Recomputed Canonical Hash:</span>
              <div
                className={`p-2.5 rounded-lg bg-background border font-mono text-[11px] break-all ${
                  result.valid
                    ? 'border-emerald-500/30 text-emerald-600 font-bold'
                    : 'border-rose-500/30 text-rose-600 font-bold'
                }`}
              >
                {result.computedHash}
              </div>
            </div>

            <div className="pt-2">
              <span className="font-semibold text-foreground block mb-1">Canonicalized String (Pre-Hash):</span>
              <pre className="p-2.5 rounded-lg bg-background border border-border font-mono text-[10px] overflow-x-auto text-muted-foreground whitespace-pre-wrap">
                {result.canonicalPayload}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

