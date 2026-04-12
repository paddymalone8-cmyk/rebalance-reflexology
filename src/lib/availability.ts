import { prisma } from './prisma';
import { format, parse, addMinutes, isBefore, isEqual } from 'date-fns';

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

/**
 * Get available slots for a given date and service duration.
 */
export async function getAvailableSlots(
  date: Date,
  durationMin: number,
  bufferMin: number = 15
): Promise<TimeSlot[]> {
  const dayOfWeek = date.getDay(); // 0-6
  const dateOnly = format(date, 'yyyy-MM-dd');

  // 1. Check if this date is blocked
  const exception = await prisma.availabilityException.findFirst({
    where: {
      date: new Date(dateOnly),
    },
  });

  if (exception?.type === 'BLOCKED') {
    return [];
  }

  // 2. Get working hours for this date
  let workingHours: { startTime: string; endTime: string }[] = [];

  if (exception?.type === 'CUSTOM' && exception.startTime && exception.endTime) {
    workingHours = [{ startTime: exception.startTime, endTime: exception.endTime }];
  } else {
    const rules = await prisma.availabilityRule.findMany({
      where: { dayOfWeek, isActive: true },
    });
    workingHours = rules.map((r) => ({ startTime: r.startTime, endTime: r.endTime }));
  }

  if (workingHours.length === 0) return [];

  // 3. Get existing confirmed/pending appointments for this date
  const existingAppointments = await prisma.appointment.findMany({
    where: {
      date: new Date(dateOnly),
      status: { in: ['PENDING', 'CONFIRMED'] },
    },
    select: { startTime: true, endTime: true, bufferMin: true },
  });

  // 4. Generate all possible slots within working hours
  const allSlots: TimeSlot[] = [];
  const slotInterval = 30; // slots every 30 minutes

  for (const hours of workingHours) {
    const baseDate = new Date(dateOnly);
    let current = parse(hours.startTime, 'HH:mm', baseDate);
    const end = parse(hours.endTime, 'HH:mm', baseDate);

    while (true) {
      const slotEnd = addMinutes(current, durationMin);
      if (isBefore(end, slotEnd) && !isEqual(end, slotEnd)) break;

      allSlots.push({
        startTime: format(current, 'HH:mm'),
        endTime: format(slotEnd, 'HH:mm'),
      });

      current = addMinutes(current, slotInterval);
    }
  }

  // 5. Filter out slots that conflict with existing appointments
  const available = allSlots.filter((slot) => {
    const slotStart = timeToMinutes(slot.startTime);
    const slotEnd = timeToMinutes(slot.endTime);

    return !existingAppointments.some((appt) => {
      const apptStart = timeToMinutes(appt.startTime);
      const apptEnd = timeToMinutes(appt.endTime) + (appt.bufferMin || 0);

      // Check overlap: slot conflicts if it starts before appt+buffer ends AND ends after appt starts
      return slotStart < apptEnd && slotEnd > apptStart - bufferMin;
    });
  });

  return available;
}

/**
 * Check if a specific slot is still available (for double-booking prevention).
 */
export async function isSlotAvailable(
  date: Date,
  startTime: string,
  endTime: string,
  bufferMin: number = 15,
  excludeAppointmentId?: string
): Promise<boolean> {
  const dateOnly = format(date, 'yyyy-MM-dd');
  const slotStart = timeToMinutes(startTime);
  const slotEnd = timeToMinutes(endTime);

  const existingAppointments = await prisma.appointment.findMany({
    where: {
      date: new Date(dateOnly),
      status: { in: ['PENDING', 'CONFIRMED'] },
      ...(excludeAppointmentId ? { NOT: { id: excludeAppointmentId } } : {}),
    },
    select: { startTime: true, endTime: true, bufferMin: true },
  });

  return !existingAppointments.some((appt) => {
    const apptStart = timeToMinutes(appt.startTime);
    const apptEnd = timeToMinutes(appt.endTime) + (appt.bufferMin || 0);
    return slotStart < apptEnd && slotEnd > apptStart - bufferMin;
  });
}

/**
 * Get dates that have any availability in a given month.
 */
export async function getAvailableDatesInMonth(
  year: number,
  month: number, // 1-12
  durationMin: number
): Promise<string[]> {
  const availableDates: string[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  const rules = await prisma.availabilityRule.findMany({
    where: { isActive: true },
  });

  const exceptions = await prisma.availabilityException.findMany({
    where: {
      date: {
        gte: new Date(`${year}-${String(month).padStart(2, '0')}-01`),
        lte: new Date(`${year}-${String(month).padStart(2, '0')}-${daysInMonth}`),
      },
    },
  });

  const blockedDates = new Set(
    exceptions
      .filter((e) => e.type === 'BLOCKED')
      .map((e) => format(e.date, 'yyyy-MM-dd'))
  );

  const customDates = new Map(
    exceptions
      .filter((e) => e.type === 'CUSTOM')
      .map((e) => [format(e.date, 'yyyy-MM-dd'), e])
  );

  const rulesByDay = new Map<number, typeof rules>();
  for (const rule of rules) {
    const existing = rulesByDay.get(rule.dayOfWeek) || [];
    existing.push(rule);
    rulesByDay.set(rule.dayOfWeek, existing);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dateStr = format(date, 'yyyy-MM-dd');

    // Skip past dates
    if (date < today) continue;

    // Skip blocked dates
    if (blockedDates.has(dateStr)) continue;

    // Check if this day has availability
    const custom = customDates.get(dateStr);
    if (custom) {
      availableDates.push(dateStr);
      continue;
    }

    const dayRules = rulesByDay.get(date.getDay());
    if (dayRules && dayRules.length > 0) {
      availableDates.push(dateStr);
    }
  }

  return availableDates;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}
