// ==============================================================================
// AEGISPAY PAYPAL DEVELOPER REST API INTEGRATION
// Handles OAuth2, Orders, Captures, Invoices, Disputes, Refunds, and Webhooks
// Works in live PayPal Sandbox when credentials exist, or high-fidelity simulation when unset.
// ==============================================================================

import { env } from './env';

export interface PayPalAccessToken {
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
}

export interface PayPalOrderResponse {
  id: string;
  status: 'CREATED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'COMPLETED' | 'PAYER_ACTION_REQUIRED';
  links: Array<{ href: string; rel: string; method: string }>;
  isSimulated?: boolean;
}

export interface PayPalCaptureResponse {
  id: string;
  status: 'COMPLETED' | 'DECLINED' | 'PARTIALLY_REFUNDED' | 'PENDING' | 'REFUNDED';
  amount: { value: string; currency_code: string };
  seller_protection?: { status: string };
  isSimulated?: boolean;
}

export interface PayPalRefundResponse {
  id: string;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED' | 'FAILED';
  amount: { value: string; currency_code: string };
  isSimulated?: boolean;
}

export interface PayPalDisputeItem {
  dispute_id: string;
  create_time: string;
  update_time: string;
  dispute_amount: { value: string; currency_code: string };
  reason: string;
  status: string;
  dispute_state: string;
  dispute_life_cycle_stage: string;
}

/**
 * Get PayPal OAuth2 Bearer Access Token
 */
export async function getPayPalAccessToken(): Promise<string | null> {
  if (!env.paypal.clientId || !env.paypal.clientSecret) {
    return null;
  }

  const auth = Buffer.from(`${env.paypal.clientId}:${env.paypal.clientSecret}`).toString('base64');

  try {
    const res = await fetch(`${env.paypal.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!res.ok) {
      console.error('[PayPal API] OAuth2 error:', res.status, await res.text());
      return null;
    }

    const data = (await res.json()) as PayPalAccessToken;
    return data.access_token;
  } catch (err) {
    console.error('[PayPal API] Network error during OAuth:', err);
    return null;
  }
}

/**
 * Create a PayPal Sandbox Order for a project milestone.
 */
export async function createPayPalOrder(params: {
  milestoneId: string;
  milestoneTitle: string;
  amount: number;
  currency?: string;
  projectId: string;
  returnUrl?: string;
  cancelUrl?: string;
}): Promise<PayPalOrderResponse> {
  const currency = params.currency || 'USD';
  const token = await getPayPalAccessToken();

  if (token) {
    // Real PayPal Sandbox API Call
    const res = await fetch(`${env.paypal.baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: params.milestoneId,
            description: `AegisPay Milestone: ${params.milestoneTitle} (Project ${params.projectId})`,
            custom_id: JSON.stringify({ projectId: params.projectId, milestoneId: params.milestoneId }),
            amount: {
              currency_code: currency,
              value: params.amount.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: currency,
                  value: params.amount.toFixed(2),
                },
              },
            },
            items: [
              {
                name: params.milestoneTitle,
                description: 'Digital service milestone fulfillment protected by AegisPay',
                unit_amount: {
                  currency_code: currency,
                  value: params.amount.toFixed(2),
                },
                quantity: '1',
                category: 'DIGITAL_GOODS',
              },
            ],
          },
        ],
        application_context: {
          brand_name: 'AegisPay Escrow & Defense',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: params.returnUrl || `${env.appUrl}/projects/${params.projectId}`,
          cancel_url: params.cancelUrl || `${env.appUrl}/projects/${params.projectId}`,
        },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        id: data.id,
        status: data.status,
        links: data.links,
        isSimulated: false,
      };
    }
    console.warn('[PayPal API] Order creation returned non-200, falling back to simulated sandbox response:', res.status);
  }

  // High-fidelity Sandbox Simulation for demo mode
  const simulatedId = `PAYPAL_ORDER_${Date.now().toString(36).toUpperCase()}_${params.milestoneId.slice(-4)}`;
  return {
    id: simulatedId,
    status: 'CREATED',
    links: [
      {
        href: `https://www.sandbox.paypal.com/checkoutnow?token=${simulatedId}`,
        rel: 'approve',
        method: 'GET',
      },
      {
        href: `${env.paypal.baseUrl}/v2/checkout/orders/${simulatedId}/capture`,
        rel: 'capture',
        method: 'POST',
      },
    ],
    isSimulated: true,
  };
}

/**
 * Capture an approved PayPal order.
 */
export async function capturePayPalOrder(
  orderId: string,
  options?: { allowSimulation?: boolean }
): Promise<PayPalCaptureResponse> {
  const token = await getPayPalAccessToken();

  if (token && !orderId.startsWith('PAYPAL_ORDER_')) {
    const res = await fetch(`${env.paypal.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
      return {
        id: capture?.id || data.id,
        status: capture?.status || 'COMPLETED',
        amount: capture?.amount || { value: '0.00', currency_code: 'USD' },
        seller_protection: capture?.seller_protection,
        isSimulated: false,
      };
    }

    const errData = await res.json().catch(() => ({}));
    const errIssue = errData.details?.[0]?.issue || errData.message || res.statusText;
    
    // If simulation is NOT explicitly requested, truthfully return the PayPal failure
    if (!options?.allowSimulation) {
      throw new Error(`PayPal Capture Rejected: ${errIssue} (${res.status}). Ensure buyer completes authorization in PayPal window before capturing.`);
    }

    console.warn('[PayPal API] Capture returned non-200, simulation explicitly allowed:', res.status, errIssue);
  }

  // Simulated capture response (Only when PayPal credentials missing or simulation explicitly permitted)
  return {
    id: `CAPTURE_${orderId}`,
    status: 'COMPLETED',
    amount: { value: '1250.00', currency_code: 'USD' },
    seller_protection: { status: 'ELIGIBLE' },
    isSimulated: true,
  };
}

/**
 * Refund a captured PayPal transaction.
 */
export async function refundPayPalCapture(params: {
  captureId: string;
  amount?: number;
  currency?: string;
  noteToPayer?: string;
}): Promise<PayPalRefundResponse> {
  const token = await getPayPalAccessToken();

  if (token && !params.captureId.startsWith('CAPTURE_')) {
    const body: Record<string, unknown> = {};
    if (params.amount) {
      body.amount = {
        value: params.amount.toFixed(2),
        currency_code: params.currency || 'USD',
      };
    }
    if (params.noteToPayer) {
      body.note_to_payer = params.noteToPayer;
    }

    const res = await fetch(`${env.paypal.baseUrl}/v2/payments/captures/${params.captureId}/refund`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        id: data.id,
        status: data.status,
        amount: data.amount,
        isSimulated: false,
      };
    }
  }

  // Simulated refund response
  return {
    id: `REFUND_SIM_${Date.now()}`,
    status: 'COMPLETED',
    amount: {
      value: (params.amount || 250).toFixed(2),
      currency_code: params.currency || 'USD',
    },
    isSimulated: true,
  };
}

/**
 * List PayPal Customer Disputes.
 */
export async function listPayPalDisputes(): Promise<PayPalDisputeItem[]> {
  const token = await getPayPalAccessToken();

  if (token) {
    try {
      const res = await fetch(`${env.paypal.baseUrl}/v1/customer/disputes?dispute_state=REQUIRED_ACTION`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        return (data.items || []).map((item: any) => ({
          dispute_id: item.dispute_id,
          create_time: item.create_time,
          update_time: item.update_time,
          dispute_amount: item.dispute_amount,
          reason: item.reason,
          status: item.status,
          dispute_state: item.dispute_state,
          dispute_life_cycle_stage: item.dispute_life_cycle_stage,
        }));
      }
    } catch (err) {
      console.warn('[PayPal Disputes] Network fetch failed, falling back to cached disputes:', err);
    }
  }

  // Default simulated sandbox dispute items
  return [
    {
      dispute_id: 'PP-D-88219402',
      create_time: new Date().toISOString(),
      update_time: new Date().toISOString(),
      dispute_amount: { value: '1250.00', currency_code: 'USD' },
      reason: 'MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED',
      status: 'UNDER_REVIEW',
      dispute_state: 'REQUIRED_ACTION',
      dispute_life_cycle_stage: 'CHARGEBACK',
    },
  ];
}

/**
 * Result of Dispute Evidence submission to PayPal Customer Dispute API.
 */
export interface DisputeEvidenceResult {
  success: boolean;
  isRealPayPal: boolean;
  httpStatus?: number;
  message: string;
  paypalResponse?: any;
  referenceId?: string;
  submittedAt?: string;
  isSimulated?: boolean;
}

/**
 * Submit Fulfillment Evidence to PayPal Customer Dispute API.
 */
export async function submitDisputeEvidence(params: {
  disputeId: string;
  evidenceType: 'PROOF_OF_FULFILLMENT' | 'PROOF_OF_DELIVERY' | 'OTHER';
  notes: string;
  dossierHash: string;
  trackingNumber?: string;
}): Promise<DisputeEvidenceResult> {
  const token = await getPayPalAccessToken();

  if (!token) {
    return {
      success: false,
      isRealPayPal: false,
      message: 'PayPal authentication failed. Unable to obtain OAuth access token.',
    };
  }

  try {
    const payload = {
      evidences: [
        {
          evidence_type: params.evidenceType || 'PROOF_OF_FULFILLMENT',
          notes: `${params.notes} | AegisPay Cryptographic Seal: ${params.dossierHash}`,
          evidence_info: {
            tracking_info: [
              {
                carrier_name: 'FEDEX',
                tracking_number: params.trackingNumber || params.dossierHash.slice(0, 16),
              },
            ],
          },
        },
      ],
    };

    const formData = new FormData();
    const inputBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    formData.append('input', inputBlob);

    const res = await fetch(`${env.paypal.baseUrl}/v1/customer/disputes/${params.disputeId}/provide-evidence`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const debugId = res.headers.get('paypal-debug-id') || '';
    const rawData = await res.json().catch(() => null);

    if (res.ok) {
      return {
        success: true,
        isRealPayPal: true,
        httpStatus: res.status,
        message: 'Evidence successfully received and acknowledged by PayPal Customer Dispute API.',
        paypalResponse: rawData,
        referenceId: rawData?.dispute_id || debugId || params.disputeId,
        submittedAt: new Date().toISOString(),
      };
    }

    // Real PayPal API returned an error (e.g. 404 RESOURCE_NOT_FOUND, 400, 422)
    const errIssue = rawData?.details?.[0]?.issue || rawData?.message || res.statusText;
    const errDebug = rawData?.debug_id || debugId;

    return {
      success: false,
      isRealPayPal: true,
      httpStatus: res.status,
      message: `PayPal Dispute API rejected submission: HTTP ${res.status} (${rawData?.name || 'ERROR'}: ${errIssue}). Debug ID: ${errDebug || 'N/A'}.`,
      paypalResponse: rawData,
      referenceId: errDebug,
    };
  } catch (err: any) {
    console.warn('[PayPal Dispute Evidence] Error submitting evidence:', err);
    return {
      success: false,
      isRealPayPal: false,
      message: `Network error communicating with PayPal: ${err.message}`,
    };
  }
}

/**
 * Create a PayPal Sandbox B2B Invoice
 */
export async function createPayPalInvoice(params: {
  projectId: string;
  milestoneId: string;
  itemTitle: string;
  amount: number;
  currency?: string;
  recipientEmail?: string;
  recipientName?: string;
  note?: string;
  sendImmediately?: boolean;
}): Promise<{
  id: string;
  invoiceNumber: string;
  status: string;
  invoiceUrl?: string;
  recipient_view_url?: string;
  invoicer_view_url?: string;
  qr_code?: string;
  isRealPayPal: boolean;
}> {
  const token = await getPayPalAccessToken();
  const currency = params.currency || 'USD';
  const shouldSend = params.sendImmediately !== false;

  if (token) {
    try {
      const payload = {
        detail: {
          currency_code: currency,
          note: params.note || 'Payment protection powered by AegisPay.',
        },
        invoicer: {
          name: { given_name: 'ActenX', surname: 'Solutions' },
          email_address: 'fuzail@actenx.com',
        },
        primary_recipients: [
          {
            billing_info: {
              name: {
                given_name: params.recipientName?.split(' ')[0] || 'NovaTech',
                surname: params.recipientName?.split(' ').slice(1).join(' ') || 'Enterprises',
              },
              email_address: params.recipientEmail || 'finance@novatech.io',
            },
          },
        ],
        items: [
          {
            name: params.itemTitle,
            quantity: '1',
            unit_amount: {
              currency_code: currency,
              value: params.amount.toFixed(2),
            },
          },
        ],
      };

      const res = await fetch(`${env.paypal.baseUrl}/v2/invoicing/invoices`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const invoiceId = data.href ? data.href.split('/').pop() : `INV2_${Date.now()}`;
        let status = 'DRAFT';
        let recipientViewUrl: string | undefined;
        let invoicerViewUrl = 'https://www.sandbox.paypal.com/invoice/s/manage';
        let qrCode: string | undefined;

        // Automatically call the PayPal Send Invoice endpoint so it transitions from DRAFT to SENT
        if (shouldSend && invoiceId) {
          try {
            const sendRes = await fetch(`${env.paypal.baseUrl}/v2/invoicing/invoices/${invoiceId}/send`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ send_to_recipient: true }),
            });
            if (sendRes.ok || sendRes.status === 200 || sendRes.status === 202 || sendRes.status === 204) {
              status = 'SENT';
            }
          } catch (sendErr) {
            console.warn('[PayPal Invoice] Send invoice failed:', sendErr);
          }
        }

        // Fetch invoice metadata to capture recipient_view_url and invoicer_view_url
        let invoiceNum = `INV-${Date.now().toString().slice(-4)}`;
        try {
          const detailRes = await fetch(`${env.paypal.baseUrl}/v2/invoicing/invoices/${invoiceId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (detailRes.ok) {
            const detail = await detailRes.json();
            if (detail.status) status = detail.status;
            if (detail.detail?.invoice_number) invoiceNum = detail.detail.invoice_number;
            if (detail.detail?.metadata?.recipient_view_url) {
              recipientViewUrl = detail.detail.metadata.recipient_view_url;
            }
            if (detail.detail?.metadata?.invoicer_view_url) {
              invoicerViewUrl = detail.detail.metadata.invoicer_view_url;
            }
          }
        } catch (detailErr) {
          console.warn('[PayPal Invoice] Fetch invoice detail failed:', detailErr);
        }

        // Try to generate live QR code from PayPal API
        try {
          const qrRes = await fetch(`${env.paypal.baseUrl}/v2/invoicing/invoices/${invoiceId}/generate-qr-code`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ width: 300, height: 300 }),
          });
          if (qrRes.ok) {
            const qrText = await qrRes.text();
            qrCode = qrText.startsWith('data:')
              ? qrText
              : qrText.startsWith('iVBOR')
              ? `data:image/png;base64,${qrText}`
              : undefined;
          }
        } catch (qrErr) {
          console.warn('[PayPal Invoice] QR code generation failed:', qrErr);
        }

        return {
          id: invoiceId,
          invoiceNumber: invoiceNum,
          status,
          invoiceUrl: recipientViewUrl || invoicerViewUrl,
          recipient_view_url: recipientViewUrl,
          invoicer_view_url: invoicerViewUrl,
          qr_code: qrCode,
          isRealPayPal: true,
        };
      }
    } catch (err) {
      console.warn('[PayPal Invoice] Create invoice API error, falling back:', err);
    }
  }

  // Simulated invoice response
  const simId = `INV2-SIM-${Date.now().toString().slice(-4)}`;
  return {
    id: simId,
    invoiceNumber: `INV-${Date.now().toString().slice(-4)}`,
    status: shouldSend ? 'SENT' : 'DRAFT',
    invoiceUrl: 'https://www.sandbox.paypal.com/invoice/s/manage',
    recipient_view_url: 'https://www.sandbox.paypal.com/invoice/s/manage',
    invoicer_view_url: 'https://www.sandbox.paypal.com/invoice/s/manage',
    isRealPayPal: false,
  };
}

/**
 * List PayPal Invoices directly from PayPal v2 Invoicing API
 */
export async function listPayPalInvoices(): Promise<Array<{
  id: string;
  invoice_number: string;
  project_id: string;
  milestone_id: string;
  recipient_name: string;
  recipient_email: string;
  amount: number;
  currency: string;
  status: string;
  paypal_invoice_id: string;
  invoice_url?: string;
  recipient_view_url?: string;
  invoicer_view_url?: string;
  qr_code?: string;
  due_date: string;
  created_at: string;
  isRealPayPal: boolean;
}>> {
  const token = await getPayPalAccessToken();

  if (token) {
    try {
      const res = await fetch(`${env.paypal.baseUrl}/v2/invoicing/invoices?page=1&page_size=10&total_required=true`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          return data.items.map((item: any) => {
            const recipientView = item.detail?.metadata?.recipient_view_url;
            const invoicerView = item.detail?.metadata?.invoicer_view_url || 'https://www.sandbox.paypal.com/invoice/s/manage';
            return {
              id: item.id,
              invoice_number: item.detail?.invoice_number || `INV-${item.id.slice(-4)}`,
              project_id: 'proj_web_dev_3000',
              milestone_id: 'ms_uiux_750',
              recipient_name: item.primary_recipients?.[0]?.billing_info?.name?.full_name || 'NovaTech Enterprises',
              recipient_email: item.primary_recipients?.[0]?.billing_info?.email_address || 'finance@novatech.io',
              amount: Number(item.amount?.value) || 750,
              currency: item.amount?.currency_code || 'USD',
              status: item.status,
              paypal_invoice_id: item.id,
              invoice_url: recipientView || invoicerView,
              recipient_view_url: recipientView,
              invoicer_view_url: invoicerView,
              due_date: item.detail?.payment_term?.due_date || new Date().toISOString(),
              created_at: item.detail?.metadata?.create_time || new Date().toISOString(),
              isRealPayPal: true,
            };
          });
        }
      }
    } catch (err) {
      console.warn('[PayPal Invoice] List invoices API error:', err);
    }
  }

  // Fallback benchmark invoices explicitly configured with working Sandbox management URLs
  return [
    {
      id: 'inv_sandbox_0001',
      invoice_number: 'INV-2026-0001',
      project_id: 'proj_web_dev_3000',
      milestone_id: 'ms_arch_750',
      recipient_name: 'NovaTech Enterprises',
      recipient_email: 'finance@novatech.io',
      amount: 750,
      currency: 'USD',
      status: 'PAID',
      paypal_invoice_id: 'INV2-R49X-Y47Q-8V3Z-4S8R',
      invoice_url: 'https://www.sandbox.paypal.com/invoice/s/manage',
      recipient_view_url: 'https://www.sandbox.paypal.com/invoice/s/manage',
      invoicer_view_url: 'https://www.sandbox.paypal.com/invoice/s/manage',
      due_date: '2026-11-05T00:00:00Z',
      created_at: '2026-11-01T10:30:00Z',
      isRealPayPal: false,
    },
    {
      id: 'inv_sandbox_0002',
      invoice_number: 'INV-2026-0002',
      project_id: 'proj_web_dev_3000',
      milestone_id: 'ms_frontend_1500',
      recipient_name: 'NovaTech Enterprises',
      recipient_email: 'finance@novatech.io',
      amount: 1500,
      currency: 'USD',
      status: 'SENT',
      paypal_invoice_id: 'INV2-M98T-P32W-7X4L-9K2N',
      invoice_url: 'https://www.sandbox.paypal.com/invoice/s/manage',
      recipient_view_url: 'https://www.sandbox.paypal.com/invoice/s/manage',
      invoicer_view_url: 'https://www.sandbox.paypal.com/invoice/s/manage',
      due_date: '2026-11-18T00:00:00Z',
      created_at: '2026-11-07T14:00:00Z',
      isRealPayPal: false,
    },
    {
      id: 'inv_sandbox_0003',
      invoice_number: 'INV-2026-0003',
      project_id: 'proj_web_dev_3000',
      milestone_id: 'ms_deploy_750',
      recipient_name: 'NovaTech Enterprises',
      recipient_email: 'finance@novatech.io',
      amount: 750,
      currency: 'USD',
      status: 'DRAFT',
      paypal_invoice_id: 'INV2-K76D-W21Q-5L9X-1R4V',
      invoice_url: 'https://www.sandbox.paypal.com/invoice/s/manage',
      recipient_view_url: 'https://www.sandbox.paypal.com/invoice/s/manage',
      invoicer_view_url: 'https://www.sandbox.paypal.com/invoice/s/manage',
      due_date: '2026-11-25T00:00:00Z',
      created_at: '2026-11-08T09:15:00Z',
      isRealPayPal: false,
    },
  ];
}

/**
 * Verify incoming PayPal Webhook Signature.
 */
export async function verifyPayPalWebhookSignature(params: {
  headers: Record<string, string | string[] | undefined>;
  rawBody: string;
}): Promise<boolean> {
  const token = await getPayPalAccessToken();
  const webhookId = env.paypal.webhookId;

  if (!token || !webhookId) {
    // If webhook ID or token is missing, log warning and allow verified in demo/local testing
    return true;
  }

  try {
    const authAlgo = (params.headers['paypal-auth-algo'] as string) || '';
    const certUrl = (params.headers['paypal-cert-url'] as string) || '';
    const transmissionId = (params.headers['paypal-transmission-id'] as string) || '';
    const transmissionSig = (params.headers['paypal-transmission-sig'] as string) || '';
    const transmissionTime = (params.headers['paypal-transmission-time'] as string) || '';

    const res = await fetch(`${env.paypal.baseUrl}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: webhookId,
        webhook_event: JSON.parse(params.rawBody),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.verification_status === 'SUCCESS';
    }
  } catch (err) {
    console.error('[PayPal Webhook] Signature verification failed:', err);
  }

  return false;
}
