import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { availabilityExceptionSchema } from '@/lib/validations';

export const GET = requireAuth(async () => {
  const exceptions = await prisma.availabilityException.findMany({
    orderBy: { date: 'asc' },
  });
  return NextResponse.json(exceptions);
});

export const POST = requireAuth(async (req: NextRequest) => {
  const body = await req.json();
  const parsed = availabilityExceptionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 });
  }

  const exception = await prisma.availabilityException.create({
    data: {
      ...parsed.data,
      date: new Date(parsed.data.date),
    },
  });
  return NextResponse.json(exception, { status: 201 });
});

export const DELETE = requireAuth(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  await prisma.availabilityException.delete({ where: { id } });
  return NextResponse.json({ success: true });
});
