'use client';

import React, { useState, useEffect } from 'react';
import { AGGridTransactions } from '@/components/AGGridTransactions';
import { FinancialTransaction } from '@/types';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/transactions')
      .then((r) => r.json())
      .then((data) => setTransactions(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Financial Ledger & Escrow Transactions</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          High-performance financial table powered by AG Grid React. Review PayPal orders, captures, refunds, and cryptographic proof hashes.
        </p>
      </div>

      <AGGridTransactions transactions={transactions} />
    </div>
  );
}
