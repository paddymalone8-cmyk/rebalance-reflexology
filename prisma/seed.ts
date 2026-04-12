import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'admin123!',
    12
  );

  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@rebalancereflexology.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@rebalancereflexology.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  // Create default services
  const services = [
    {
      name: 'Reflexology — 60 Minutes',
      description:
        'A full reflexology session working on pressure points across the feet to promote deep relaxation, improve circulation, and support the body\'s natural healing processes.',
      durationMin: 60,
      price: 4500, // £45.00
      sortOrder: 1,
    },
    {
      name: 'Reflexology — 90 Minutes',
      description:
        'An extended session allowing for a more thorough treatment. Ideal for those with specific concerns or anyone seeking a deeper level of relaxation and restoration.',
      durationMin: 90,
      price: 6000, // £60.00
      sortOrder: 2,
    },
    {
      name: 'Indian Head Massage — 45 Minutes',
      description:
        'Gentle massage focusing on the head, neck, and shoulders to relieve tension, ease headaches, and promote a sense of calm and wellbeing.',
      durationMin: 45,
      price: 3500, // £35.00
      sortOrder: 3,
    },
    {
      name: 'Reflexology & Indian Head Massage — 90 Minutes',
      description:
        'The ultimate combination treatment. Begin with a full reflexology session followed by a soothing Indian head massage for total mind-body relaxation.',
      durationMin: 90,
      price: 7000, // £70.00
      sortOrder: 4,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.name.replace(/[^a-z0-9]/gi, '-').toLowerCase() },
      update: service,
      create: {
        id: service.name.replace(/[^a-z0-9]/gi, '-').toLowerCase(),
        ...service,
      },
    });
  }

  // Create default availability rules (Tue 6-9pm, Sat 10-2pm)
  const rules = [
    { dayOfWeek: 2, startTime: '18:00', endTime: '21:00' }, // Tuesday
    { dayOfWeek: 6, startTime: '10:00', endTime: '14:00' }, // Saturday
  ];

  for (const rule of rules) {
    const existing = await prisma.availabilityRule.findFirst({
      where: { dayOfWeek: rule.dayOfWeek, startTime: rule.startTime },
    });
    if (!existing) {
      await prisma.availabilityRule.create({ data: rule });
    }
  }

  // Create default site content
  const content = [
    { key: 'hero_tagline', value: 'Find your balance. Restore your wellbeing.' },
    { key: 'hero_subtitle', value: 'Professional reflexology treatments in Northern Ireland. Gentle, natural healing for body and mind.' },
    {
      key: 'about_text',
      value:
        'Reflexology is a complementary therapy based on the principle that areas on the feet correspond to different organs and systems of the body. By applying gentle pressure to these reflex points, reflexology can help reduce stress, improve circulation, and encourage the body\'s natural healing processes.\n\nAt Rebalance Reflexology, each session is tailored to your individual needs. Whether you\'re seeking relief from tension, support during a difficult time, or simply a moment of deep relaxation, you\'re in caring and experienced hands.',
    },
    { key: 'buffer_minutes', value: '15' },
  ];

  for (const item of content) {
    await prisma.siteContent.upsert({
      where: { key: item.key },
      update: { value: item.value },
      create: item,
    });
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
