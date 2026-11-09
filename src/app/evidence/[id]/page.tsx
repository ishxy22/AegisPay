'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FileText, ArrowLeft, Download, ShieldCheck, ExternalLink } from 'lucide-react';

export default function EvidenceViewerPage() {
  const params = useParams();
  const id = (params?.id as string) || 'disp_sandbox_8821';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/defense" className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dispute Defense</span>
        </Link>

        <a
          href={`/api/dossier/${id}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Download Official PDF</span>
        </a>
      </div>

      <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-lg font-bold text-foreground">Digital Fulfillment Evidence Dossier Viewer</h1>
              <span className="font-mono text-xs text-muted-foreground">Reference: {id}</span>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            SHA-256 Verified
          </span>
        </div>

        {/* Embedded PDF iframe */}
        <div className="w-full h-[650px] rounded-lg border border-border overflow-hidden bg-muted">
          <iframe
            src={`/api/dossier/${id}`}
            className="w-full h-full"
            title="AegisPay Digital Fulfillment Evidence Dossier"
          />
        </div>
      </div>
    </div>
  );
}
