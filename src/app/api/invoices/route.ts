import { NextRequest, NextResponse } from 'next/server';
import { listPayPalInvoices, createPayPalInvoice } from '@/lib/paypal';

export async function GET() {
  try {
    const invoices = await listPayPalInvoices();
    return NextResponse.json(invoices);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, projectId, milestoneId, itemTitle, amount, currency, recipientEmail, recipientName, note } = body;

    // Handle activate / send live action from PayPal Invoice Inspector Modal
    if (action === 'send' || action === 'activate') {
      const invoice = await createPayPalInvoice({
        projectId: projectId || 'proj_web_dev_3000',
        milestoneId: milestoneId || 'ms_arch_750',
        itemTitle: itemTitle || `Milestone Fulfillment Acceptance (${milestoneId || '0003'})`,
        amount: Number(amount) || 750,
        currency: currency || 'USD',
        recipientEmail: recipientEmail || 'finance@novatech.io',
        recipientName: recipientName || 'NovaTech Enterprises',
        note: note || 'AegisPay live PayPal Sandbox B2B escrow invoice.',
        sendImmediately: true,
      });

      return NextResponse.json({ success: true, invoice });
    }

    if (!amount || !itemTitle) {
      return NextResponse.json({ error: 'Item title and amount are required' }, { status: 400 });
    }

    const invoice = await createPayPalInvoice({
      projectId: projectId || 'proj_web_dev_3000',
      milestoneId: milestoneId || 'ms_uiux_750',
      itemTitle,
      amount: Number(amount),
      currency: currency || 'USD',
      recipientEmail: recipientEmail || 'finance@novatech.io',
      recipientName: recipientName || 'NovaTech Enterprises',
      note,
      sendImmediately: true,
    });

    return NextResponse.json({ success: true, invoice }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
