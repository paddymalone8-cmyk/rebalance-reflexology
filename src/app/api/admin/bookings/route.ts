import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export const GET = requireAuth(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (from || to) {
    where.date = {};
    if (from) (where.date as Record<string, unknown>).gte = new Date(from);
    if (to) (where.date as Record<string, unknown>).lte = new Date(to);
  }

  const appointments = await prisma.appointment.findMany({
    where,
    include: { service: true },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  });

  return NextResponse.json(appointments);
});

export const PATCH = requireAuth(async (req: NextRequest) => {
  const body = await req.json();
  const { id, status, date, startTime, endTime } = body;

  if (!id) return NextResponse.json({ error: 'Appointment ID required' }, { status: 400 });

  const updateData: Record<string, unknown> = {};
  if (status) updateData.status = status;
  if (date) updateData.date = new Date(date);
  if (startTime) updateData.startTime = startTime;
  if (endTime) updateData.endTime = endTime;

  const appointment = await prisma.appointment.update({
    where: { id },
    data: updateData,
    include: { service: true },
  });

  return NextResponse.json(appointment);
});
