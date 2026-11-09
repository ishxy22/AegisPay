import { NextRequest, NextResponse } from 'next/server';
import { generateMilestonesWithGemini } from '@/lib/ai/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.totalBudget) {
      return NextResponse.json(
        { error: 'Project title and total budget are required' },
        { status: 400 }
      );
    }

    const milestones = await generateMilestonesWithGemini({
      title: body.title,
      description: body.description || '',
      totalBudget: Number(body.totalBudget),
      currency: body.currency || 'USD',
      deadline: body.deadline || '',
      brief: body.brief || body.description || body.title,
    });

    return NextResponse.json({
      success: true,
      milestones,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
