import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const content = await prisma.siteContent.findMany();
    const contentMap: Record<string, string> = {};
    for (const item of content) {
      contentMap[item.key] = item.value;
    }
    return NextResponse.json(contentMap);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}
