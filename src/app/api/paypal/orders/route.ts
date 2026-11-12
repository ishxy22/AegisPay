import { NextRequest, NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();
    const { milestoneId, amount, currency, idempotencyKey } = body;

    if (!milestoneId) {
      return NextResponse.json({ error: 'Milestone ID required' }, { status: 400 });
    }

    const milestone = await db.getMilestoneById(milestoneId);
    if (!milestone) {
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });
    }

    // Idempotency check: if milestone already has a PayPal order assigned and payment is pending
    if (milestone.paypal_order_id && milestone.status === 'payment_requested' && !idempotencyKey) {
      return NextResponse.json({
        success: true,
        idempotent: true,
        message: 'Order already initiated for this milestone',
        order: {
          id: milestone.paypal_order_id,
          status: 'CREATED',
          amount: { value: String(milestone.allocated_amount), currency_code: 'USD' },
          links: [{ rel: 'approve', href: `https://www.sandbox.paypal.com/checkoutnow?token=${milestone.paypal_order_id}` }],
        },
      });
    }

    const order = await createPayPalOrder({
      milestoneId: milestone.id,
      milestoneTitle: milestone.title,
      amount: amount || milestone.allocated_amount,
      currency: currency || 'USD',
      projectId: milestone.project_id,
    });

    // Update milestone with order ID
    await db.updateMilestone(milestone.id, {
      paypal_order_id: order.id,
      status: 'payment_requested',
    });

    const project = await db.getProjectById(milestone.project_id);
    const clientId = project?.client_id || session?.userId || 'usr_client';
    const clientName = project?.client_name || session?.fullName || 'Client Buyer';
    const providerId = project?.provider_id || (milestone.assignee_email ? `usr_${milestone.assignee_email}` : 'usr_provider');
    const providerName = project?.provider_name || milestone.assignee_name || 'Service Provider';

    // Record initiated transaction
    await db.createTransaction({
      id: crypto.randomUUID(),
      project_id: milestone.project_id,
      milestone_id: milestone.id,
      client_id: clientId,
      client_name: clientName,
      provider_id: providerId,
      provider_name: providerName,
      amount: amount || milestone.allocated_amount,
      currency: currency || 'USD',
      type: 'milestone_payment',
      status: 'initiated',
      paypal_order_id: order.id,
      verification_status: 'unverified',
      notes: `PayPal Checkout Order generated for ${milestone.title}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
