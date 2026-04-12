import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { availabilityRuleSchema } from '@/lib/validations';

export const GET = requireAuth(async () => {
  const rules = await prisma.availabilityRule.findMany({
    orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
  });
  return NextResponse.json(rules);
});

export const POST = requireAuth(async (req: NextRequest) => {
  const body = await req.json();
  const parsed = availabilityRuleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 });
  }

  const rule = await prisma.availabilityRule.create({ data: parsed.data });
  return NextResponse.json(rule, { status: 201 });
});

export const DELETE = requireAuth(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  await prisma.availabilityRule.delete({ where: { id } });
  return NextResponse.json({ success: true });
});
