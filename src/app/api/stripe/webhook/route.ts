import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { sendBookingConfirmation } from '@/lib/email';
import { format } from 'date-fns';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const appointmentId = session.metadata?.appointmentId;

        if (!appointmentId) {
          console.error('No appointmentId in session metadata');
          break;
        }

        const appointment = await prisma.appointment.update({
          where: { id: appointmentId },
          data: {
            status: 'CONFIRMED',
            stripePaymentId: session.payment_intent as string,
            amountPaid: session.amount_total || undefined,
          },
          include: { service: true },
        });

        // Send confirmation email
        try {
          await sendBookingConfirmation({
            clientName: appointment.clientName,
            clientEmail: appointment.clientEmail,
            serviceName: appointment.service.name,
            date: format(appointment.date, 'EEEE do MMMM yyyy'),
            startTime: appointment.startTime,
            endTime: appointment.endTime,
            amountPaid: `£${((appointment.amountPaid || 0) / 100).toFixed(2)}`,
          });
        } catch (emailErr) {
          console.error('Email send failed:', emailErr);
        }

        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const appointmentId = session.metadata?.appointmentId;

        if (appointmentId) {
          await prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: 'CANCELLED' },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error('Webhook processing error:', e);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
