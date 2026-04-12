import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { serviceSchema } from '@/lib/validations';

export const GET = requireAuth(async () => {
  const services = await prisma.service.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(services);
});

export const POST = requireAuth(async (req: NextRequest) => {
  const body = await req.json();
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 });
  }
  const service = await prisma.service.create({ data: parsed.data });
  return NextResponse.json(service, { status: 201 });
});

export const PUT = requireAuth(async (req: NextRequest) => {
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: 'Service ID required' }, { status: 400 });

  const service = await prisma.service.update({ where: { id }, data });
  return NextResponse.json(service);
});

export const DELETE = requireAuth(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  await prisma.service.update({ where: { id }, data: { isActive: false } });
  return NextResponse.json({ success: true });
});
