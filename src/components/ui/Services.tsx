"use client";

import Link from "next/link";

export default function Services() {
  return (
    <section id="services" className="py-24 md:py-32 bg-sand-50 relative">
      <div className="section-container">
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
            Each treatment is tailored to your needs in a calm, comfortable private studio setting.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Foot Reflexology */}
          <div className="card p-8 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="text-brand-500 mb-4">
                <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                  <path d="M24 12c-4 0-8 6-8 14s4 14 8 14 8-6 8-14-4-14-8-14z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <circle cx="24" cy="22" r="3" stroke="currentColor" strokeWidth="1" />
                </svg>
              </div>
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="font-display text-xl text-brand-900">Foot Reflexology</h3>
                <span className="font-display text-2xl text-brand-700 font-semibold">&pound;40</span>
              </div>
              <p className="font-body text-xs text-brand-500 tracking-wide uppercase mb-3">
                60 minutes
              </p>
              <p className="font-body text-sm text-sage-600 leading-relaxed mb-6">
                A full reflexology session working on pressure points across the feet to promote deep
                relaxation, improve circulation, and support the body&apos;s natural healing processes.
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

          {/* Hand Reflexology - Coming Soon */}
          <div className="card p-8 relative overflow-hidden opacity-75">
            <div className="relative z-10">
              <div className="text-brand-400 mb-4">
                <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                  <path d="M20 36V22c0-2.2-1.8-4-4-4s-4 1.8-4 4v6" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <path d="M20 22v-6c0-2.2 1.8-4 4-4s4 1.8 4 4v6" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <path d="M28 24v-4c0-2.2 1.8-4 4-4s4 1.8 4 4v8c0 6-4 12-12 12h-2c-6 0-10-4-10-10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="font-display text-xl text-brand-900">Hand Reflexology</h3>
              </div>
              <div className="inline-block bg-sand-200 text-sand-700 font-body text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full mb-3">
                Coming Soon
              </div>
              <p className="font-body text-sm text-sage-600 leading-relaxed">
                A gentle yet effective treatment focusing on reflex points in the hands. Ideal for
                those who prefer an alternative to foot reflexology. Details and booking available soon.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <Link href="/booking" className="btn-primary">
            Book Your Appointment
          </Link>
        </div>
      </div>
    </section>
  );
}
