import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { bookingSchema } from '@/lib/validations';
import { isSlotAvailable } from '@/lib/availability';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const { success } = rateLimit(`booking:${ip}`, 10, 60 * 1000);
  if (!success) {
    return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid booking data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { serviceId, date, startTime, endTime, clientName, clientEmail, clientPhone, notes } =
      parsed.data;

    // Verify service exists
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service || !service.isActive) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Check slot is still available (prevent double booking)
    const available = await isSlotAvailable(new Date(date), startTime, endTime);
    if (!available) {
      return NextResponse.json(
        { error: 'This time slot is no longer available. Please choose another.' },
        { status: 409 }
      );
    }

    // Determine charge amount (deposit or full)
    const chargeAmount = service.depositPrice || service.price;

    // Create pending appointment
    const appointment = await prisma.appointment.create({
      data: {
        serviceId,
        date: new Date(date),
        startTime,
        endTime,
        clientName,
        clientEmail,
        clientPhone: clientPhone || null,
        notes: notes || null,
        status: 'PENDING',
        amountPaid: chargeAmount,
      },
    });

    // Create Stripe Checkout session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: clientEmail,
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: service.name,
              description: `${date} at ${startTime} – ${endTime}`,
            },
            unit_amount: chargeAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        appointmentId: appointment.id,
      },
      success_url: `${appUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/booking/cancelled?appointment_id=${appointment.id}`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 min expiry
    });

    // Update appointment with Stripe session ID
    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (e) {
    console.error('Create session error:', e);
    return NextResponse.json({ error: 'Failed to create booking session' }, { status: 500 });
  }
}
