'use client';

import React, { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ICellRendererParams, AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { FinancialTransaction } from '@/types';
import { StatusBadge } from './StatusBadge';
import { Download, Search, ShieldCheck, ExternalLink, X, FileText, CheckCircle2 } from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule]);

interface AGGridTransactionsProps {
  transactions: FinancialTransaction[];
}

export function AGGridTransactions({ transactions }: AGGridTransactionsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTx, setSelectedTx] = useState<FinancialTransaction | null>(null);

  const columnDefs = useMemo<ColDef<FinancialTransaction>[]>(
    () => [
      {
        field: 'id',
        headerName: 'Transaction ID',
        width: 140,
        cellRenderer: (params: ICellRendererParams) => (
          <span className="font-mono text-xs font-semibold text-primary">{params.value}</span>
        ),
      },
      {
        field: 'client_name',
        headerName: 'Client',
        width: 170,
        filter: true,
      },
      {
        field: 'provider_name',
        headerName: 'Service Provider',
        width: 180,
      },
      {
        field: 'amount',
        headerName: 'Amount',
        width: 120,
        sortable: true,
        cellRenderer: (params: ICellRendererParams) => (
          <span className="font-semibold text-foreground">
            ${Number(params.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        ),
      },
      {
        field: 'currency',
        headerName: 'Currency',
        width: 90,
      },
      {
        field: 'status',
        headerName: 'PayPal Status',
        width: 140,
        filter: true,
        cellRenderer: (params: ICellRendererParams) => <StatusBadge status={params.value} />,
      },
      {
        field: 'verification_status',
        headerName: 'Proof Status',
        width: 130,
        cellRenderer: (params: ICellRendererParams) => <StatusBadge status={params.value} />,
      },
      {
        field: 'receipt_hash',
        headerName: 'SHA-256 Receipt Seal',
        width: 180,
        cellRenderer: (params: ICellRendererParams) => (
          <span className="font-mono text-[11px] text-muted-foreground truncate block" title={params.value}>
            {params.value ? `${params.value.slice(0, 16)}...` : 'Pending Proof'}
          </span>
        ),
      },
      {
        field: 'created_at',
        headerName: 'Timestamp',
        width: 160,
        sortable: true,
        cellRenderer: (params: ICellRendererParams) => (
          <span className="text-xs text-muted-foreground">
            {new Date(params.value).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
          </span>
        ),
      },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      resizable: true,
    }),
    []
  );

  const filteredTransactions = useMemo(() => {
    if (!searchTerm) return transactions;
    const lower = searchTerm.toLowerCase();
    return transactions.filter(
      (t) =>
        t.id.toLowerCase().includes(lower) ||
        t.client_name.toLowerCase().includes(lower) ||
        t.provider_name.toLowerCase().includes(lower) ||
        t.status.toLowerCase().includes(lower)
    );
  }, [transactions, searchTerm]);

  const handleExportCsv = () => {
    const headers = ['Transaction ID', 'Client', 'Provider', 'Amount', 'Currency', 'PayPal Status', 'Proof Status', 'Receipt Hash', 'Timestamp'];
    const rows = filteredTransactions.map((t) => [
      t.id,
      t.client_name,
      t.provider_name,
      t.amount,
      t.currency,
      t.status,
      t.verification_status,
      t.receipt_hash || '',
      t.created_at,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aegispay-ledger-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transactions, clients, or proof seals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted text-foreground transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* AG Grid React Container */}
      <div className="ag-theme-quartz w-full h-[480px] shadow-sm rounded-lg overflow-hidden border border-border">
        <AgGridReact
          modules={[AllCommunityModule]}
          theme="legacy"
          rowData={filteredTransactions}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={10}
          onRowClicked={(e) => setSelectedTx(e.data || null)}
          rowSelection="single"
        />
      </div>

      {/* Transaction Detail Drawer Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card text-card-foreground border border-border rounded-xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-base text-foreground">Transaction Audit Record</h3>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-muted-foreground hover:text-foreground rounded p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-mono font-bold text-foreground">{selectedTx.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">PayPal Order ID:</span>
                <span className="font-mono text-foreground">{selectedTx.paypal_order_id || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">PayPal Capture ID:</span>
                <span className="font-mono text-foreground">{selectedTx.paypal_capture_id || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Amount & Currency:</span>
                <span className="font-bold text-emerald-600 text-sm">
                  ${selectedTx.amount} {selectedTx.currency}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Status:</span>
                <StatusBadge status={selectedTx.status} />
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Proof-of-Work Status:</span>
                <StatusBadge status={selectedTx.verification_status} />
              </div>

              {/* SHA-256 Proof Seal */}
              <div className="pt-2">
                <span className="text-muted-foreground block mb-1 font-semibold">Cryptographic Receipt Hash (SHA-256):</span>
                <div className="p-2.5 rounded-lg bg-muted/60 border border-border font-mono text-[11px] break-all text-foreground">
                  {selectedTx.receipt_hash || 'No cryptographic receipt generated yet'}
                </div>
              </div>

              {/* Notes */}
              {selectedTx.notes && (
                <div className="pt-1">
                  <span className="text-muted-foreground block mb-1 font-semibold">Ledger Notes:</span>
                  <p className="text-muted-foreground bg-muted/30 p-2 rounded border border-border/50 leading-relaxed">
                    {selectedTx.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <a
                href={`/api/dossier/disp_sandbox_8821`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Download Dossier PDF</span>
              </a>

              <button
                onClick={() => setSelectedTx(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:bg-muted text-foreground transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
