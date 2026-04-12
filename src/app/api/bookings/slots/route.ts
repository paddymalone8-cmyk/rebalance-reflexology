import { NextRequest, NextResponse } from 'next/server';
import { getAvailableSlots, getAvailableDatesInMonth } from '@/lib/availability';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');
  const month = searchParams.get('month'); // yyyy-MM
  const duration = parseInt(searchParams.get('duration') || '60');

  try {
    // If month is provided, return available dates for the calendar
    if (month) {
      const [year, m] = month.split('-').map(Number);
      const dates = await getAvailableDatesInMonth(year, m, duration);
      return NextResponse.json({ dates });
    }

    // If date is provided, return available time slots
    if (date) {
      const slots = await getAvailableSlots(new Date(date), duration);
      return NextResponse.json({ slots });
    }

    return NextResponse.json({ error: 'Provide date or month parameter' }, { status: 400 });
  } catch (e) {
    console.error('Availability error:', e);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}
