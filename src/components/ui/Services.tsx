'use client';

import Link from 'next/link';

const services = [
  {
    name: 'Reflexology',
    duration: '60 min',
    price: '£45',
    description:
      'A full reflexology session working on pressure points across the feet to promote deep relaxation, improve circulation, and support natural healing.',
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        <path d="M24 12c-4 0-8 6-8 14s4 14 8 14 8-6 8-14-4-14-8-14z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="24" cy="22" r="3" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
  },
  {
    name: 'Reflexology',
    duration: '90 min',
    price: '£60',
    description:
      'An extended session for a more thorough treatment. Ideal for specific concerns or anyone seeking deeper restoration.',
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        <path d="M18 14c0 0 0 8-2 14s4 10 8 10 10-4 8-10-2-14-2-14" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M20 24h8" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <path d="M21 28h6" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      </svg>
    ),
  },
  {
    name: 'Indian Head Massage',
    duration: '45 min',
    price: '£35',
    description:
      'Gentle massage focusing on head, neck, and shoulders to relieve tension, ease headaches, and promote calm.',
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        <circle cx="24" cy="18" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M16 32c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    ),
  },
  {
    name: 'Combined Treatment',
    duration: '90 min',
    price: '£70',
    description:
      'The ultimate combination — reflexology followed by Indian head massage for complete mind-body relaxation.',
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        <path d="M16 24c0-6 3-12 8-12s8 6 8 12" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M16 24c0 6 3 12 8 12s8-6 8-12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
        <circle cx="24" cy="24" r="3" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 md:py-32 bg-sand-50 relative">
      <div className="section-container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-brand-500" />
            <span className="font-body text-xs tracking-[0.25em] uppercase text-brand-600">Treatments</span>
            <div className="w-8 h-px bg-brand-500" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-brand-900 font-light leading-tight mb-4">
            Services &amp; <span className="italic text-brand-600">Pricing</span>
          </h2>
          <p className="font-body text-sage-600 leading-relaxed">
            Each treatment is tailored to your needs. All sessions take place in a calm, comfortable setting.
          </p>
        </div>

        {/* Service cards */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {services.map((service, i) => (
            <div
              key={i}
              className="card p-8 group relative overflow-hidden"
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="text-brand-500 mb-4">{service.icon}</div>

                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="font-display text-xl text-brand-900">{service.name}</h3>
                  <span className="font-display text-2xl text-brand-700 font-semibold">{service.price}</span>
                </div>

                <p className="font-body text-xs text-brand-500 tracking-wide uppercase mb-3">
                  {service.duration}
                </p>

                <p className="font-body text-sm text-sage-600 leading-relaxed mb-6">
                  {service.description}
                </p>

                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 font-body text-sm font-semibold text-brand-700 hover:text-brand-500 transition-colors group/link"
                >
                  Book this treatment
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="transition-transform group-hover/link:translate-x-1"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link href="/booking" className="btn-primary">
            Book Your Appointment
          </Link>
        </div>
      </div>
    </section>
  );
}
