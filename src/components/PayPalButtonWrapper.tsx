'use client';

import React, { useState } from 'react';
import { CreditCard, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface PayPalButtonWrapperProps {
  milestoneId: string;
  amount: number;
  currency?: string;
  onSuccess?: () => void;
}

export function PayPalButtonWrapper({ milestoneId, amount, currency = 'USD', onSuccess }: PayPalButtonWrapperProps) {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePayNow = async () => {
    setLoading(true);
    setStatusMessage('Initiating PayPal Sandbox order...');
    setError(null);

    try {
      // 1. Create PayPal Order
      const orderRes = await fetch('/api/paypal/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId, amount, currency }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to create PayPal order');
      }

      const orderId = orderData.order.id;
      setStatusMessage(`Order ${orderId} created. Processing capture...`);

      // 2. Capture PayPal Order
      const captureRes = await fetch(`/api/paypal/orders/${orderId}/capture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId }),
      });

      const captureData = await captureRes.json();
      if (!captureRes.ok || !captureData.success) {
        throw new Error(captureData.error || 'Failed to capture PayPal order');
      }

      setStatusMessage('Payment successfully captured & funds recorded in milestone ledger!');
      if (onSuccess) {
        setTimeout(onSuccess, 1200);
      }
    } catch (err: any) {
      setError(err.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handlePayNow}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#0070BA] hover:bg-[#005ea6] text-white shadow-sm transition-all disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CreditCard className="h-4 w-4" />
        )}
        <span>Pay with PayPal Sandbox (${amount} {currency})</span>
      </button>

      {statusMessage && (
        <div className="flex items-center gap-2 p-2.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs border border-emerald-500/20">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-2.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs border border-rose-500/20">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
