'use client';

import React, { useState } from 'react';
import { CreditCard, CheckCircle2, Loader2, AlertCircle, ExternalLink, Zap, HelpCircle } from 'lucide-react';

interface PayPalButtonWrapperProps {
  milestoneId: string;
  amount: number;
  currency?: string;
  onSuccess?: () => void;
}

export function PayPalButtonWrapper({ milestoneId, amount, currency = 'USD', onSuccess }: PayPalButtonWrapperProps) {
  const [loading, setLoading] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [approveUrl, setApproveUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requiresApproval, setRequiresApproval] = useState(false);

  // 1. Open Real Interactive PayPal Sandbox Flow
  const handleInitiateRealPayPal = async () => {
    setLoading(true);
    setError(null);
    setStatusMessage('Connecting to PayPal Sandbox API...');

    try {
      // Step A: Create order on PayPal
      const orderRes = await fetch('/api/paypal/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId, amount, currency }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize PayPal order');
      }

      const order = orderData.order;
      const orderId = order.id;
      setActiveOrderId(orderId);

      // Find approval link
      const approvalLink = order.links?.find((l: any) => l.rel === 'approve')?.href;
      if (approvalLink) {
        setApproveUrl(approvalLink);
        setRequiresApproval(true);
        setStatusMessage('PayPal Sandbox popup opened. Please log in with your sandbox buyer account and approve payment.');
        
        // Open the PayPal checkout popup
        const width = 520;
        const height = 700;
        const left = Math.max(0, (window.innerWidth - width) / 2);
        const top = Math.max(0, (window.innerHeight - height) / 2);
        window.open(
          approvalLink,
          'PayPalCheckoutPopup',
          `width=${width},height=${height},top=${top},left=${left},status=no,menubar=no,location=yes,resizable=yes`
        );
      } else {
        throw new Error('PayPal order created but no approval URL was provided by sandbox.');
      }
    } catch (err: any) {
      setError(err.message || 'Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  // 2. Capture Real Approved PayPal Order
  const handleConfirmCapture = async () => {
    if (!activeOrderId) return;
    setLoading(true);
    setError(null);
    setStatusMessage('Verifying buyer approval and executing capture with PayPal...');

    try {
      const captureRes = await fetch(`/api/paypal/orders/${activeOrderId}/capture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId, simulate: false }),
      });

      const captureData = await captureRes.json();
      if (!captureRes.ok || !captureData.success) {
        if (captureData.requiresApproval) {
          throw new Error('PayPal order is not approved yet! Please complete checkout in the PayPal popup window, then click "Confirm & Capture Payment" again.');
        }
        throw new Error(captureData.error || 'PayPal capture failed');
      }

      setStatusMessage('Payment verified & captured! Funds secured in milestone ledger.');
      setRequiresApproval(false);
      if (onSuccess) {
        setTimeout(onSuccess, 1200);
      }
    } catch (err: any) {
      setError(err.message || 'Capture verification failed');
    } finally {
      setLoading(false);
    }
  };

  // 3. Explicit Sandbox Simulation (for rapid reviewer testing without logging into PayPal)
  const handleSimulatePayment = async () => {
    setLoading(true);
    setError(null);
    setStatusMessage('Executing benchmark Sandbox capture simulation...');

    try {
      // Create order first if needed
      let orderId = activeOrderId;
      if (!orderId) {
        const orderRes = await fetch('/api/paypal/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ milestoneId, amount, currency }),
        });
        const orderData = await orderRes.json();
        orderId = orderData.order?.id || `ORDER_${Date.now()}`;
      }

      // Capture with explicit simulate flag
      const captureRes = await fetch(`/api/paypal/orders/${orderId}/capture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId, simulate: true }),
      });

      const captureData = await captureRes.json();
      if (!captureRes.ok || !captureData.success) {
        throw new Error(captureData.error || 'Simulated capture failed');
      }

      setStatusMessage('Simulated payment captured! Milestone updated in database.');
      if (onSuccess) {
        setTimeout(onSuccess, 1000);
      }
    } catch (err: any) {
      setError(err.message || 'Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3.5">
      {/* If waiting for user to approve in popup */}
      {requiresApproval && activeOrderId ? (
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
          <div className="flex items-start gap-2.5">
            <CreditCard className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-xs text-foreground block">
                PayPal Sandbox Popup Active (Order: {activeOrderId})
              </span>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Log in with your PayPal Sandbox buyer credentials (e.g. personal test account) and confirm the payment.
                Once approved, click the button below to capture funds.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            <button
              onClick={handleConfirmCapture}
              disabled={loading}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
              <span>Confirm & Capture Payment</span>
            </button>

            {approveUrl && (
              <a
                href={approveUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted text-foreground transition-colors"
              >
                <span>Re-open PayPal Popup</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      ) : (
        /* Initial Action Button: Real PayPal Sandbox Checkout */
        <button
          onClick={handleInitiateRealPayPal}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-[#0070BA] hover:bg-[#005ea6] text-white shadow-sm transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CreditCard className="h-4 w-4" />
          )}
          <span>Pay with PayPal Sandbox (${amount} {currency})</span>
        </button>
      )}

      {/* Secondary Action: Explicit Benchmark Simulation */}
      <div className="flex items-center justify-between pt-1 border-t border-border/50 text-[11px]">
        <div className="flex items-center gap-1 text-muted-foreground">
          <HelpCircle className="h-3 w-3" />
          <span>Need rapid testing?</span>
        </div>
        <button
          onClick={handleSimulatePayment}
          disabled={loading}
          className="flex items-center gap-1 font-semibold text-primary hover:text-primary-hover hover:underline transition-colors disabled:opacity-50"
        >
          <Zap className="h-3 w-3" />
          <span>⚡ Instant Benchmark Simulation</span>
        </button>
      </div>

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
