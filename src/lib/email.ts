import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface BookingEmailData {
  clientName: string;
  clientEmail: string;
  serviceName: string;
  date: string;
  startTime: string;
  endTime: string;
  amountPaid: string;
}

export async function sendBookingConfirmation(data: BookingEmailData) {
  if (!process.env.SMTP_USER) {
    console.log('SMTP not configured, skipping email. Would have sent:', data);
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Georgia', serif; color: #143d36; background: #f9f5ee; margin: 0; padding: 0; }
        .container { max-width: 560px; margin: 0 auto; padding: 40px 24px; }
        .header { text-align: center; padding-bottom: 32px; border-bottom: 1px solid #d9f0e8; }
        .header h1 { font-size: 28px; color: #1a5c4f; margin: 0; letter-spacing: 2px; }
        .header p { color: #52ab93; margin-top: 4px; font-size: 13px; letter-spacing: 3px; text-transform: uppercase; }
        .content { padding: 32px 0; }
        .content h2 { font-size: 20px; color: #1a5c4f; margin-bottom: 16px; }
        .detail { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e9ece4; }
        .detail-label { color: #798969; font-size: 14px; }
        .detail-value { color: #143d36; font-weight: 600; font-size: 14px; }
        .footer { text-align: center; padding-top: 32px; border-top: 1px solid #d9f0e8; color: #96a385; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Rebalance</h1>
          <p>Reflexology</p>
        </div>
        <div class="content">
          <h2>Booking Confirmed</h2>
          <p>Hello ${data.clientName},</p>
          <p>Your appointment has been confirmed. Here are the details:</p>
          <div class="detail">
            <span class="detail-label">Service</span>
            <span class="detail-value">${data.serviceName}</span>
          </div>
          <div class="detail">
            <span class="detail-label">Date</span>
            <span class="detail-value">${data.date}</span>
          </div>
          <div class="detail">
            <span class="detail-label">Time</span>
            <span class="detail-value">${data.startTime} – ${data.endTime}</span>
          </div>
          <div class="detail">
            <span class="detail-label">Amount Paid</span>
            <span class="detail-value">${data.amountPaid}</span>
          </div>
          <p style="margin-top: 24px; font-size: 14px; color: #5f6d52;">
            If you need to cancel or reschedule, please get in touch as soon as possible.
          </p>
        </div>
        <div class="footer">
          <p>Rebalance Reflexology · Northern Ireland</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"Rebalance Reflexology" <bookings@rebalancereflexology.com>',
    to: data.clientEmail,
    subject: `Booking Confirmed — ${data.serviceName} on ${data.date}`,
    html,
  });
}
