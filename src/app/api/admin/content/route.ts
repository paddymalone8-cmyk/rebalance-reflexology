import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export const GET = requireAuth(async () => {
  const content = await prisma.siteContent.findMany();
  return NextResponse.json(content);
});

export const PUT = requireAuth(async (req: NextRequest) => {
  const body = await req.json();
  const { key, value } = body;

  if (!key || typeof value !== 'string') {
    return NextResponse.json({ error: 'Key and value required' }, { status: 400 });
  }

  const updated = await prisma.siteContent.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });

  return NextResponse.json(updated);
});
