'use client';

export default function FindUs() {
  return (
    <section id="find-us" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="section-container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-brand-500" />
            <span className="font-body text-xs tracking-[0.25em] uppercase text-brand-600">
              Location
            </span>
            <div className="w-8 h-px bg-brand-500" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-brand-900 font-light leading-tight mb-4">
            Find <span className="italic text-brand-600">Us</span>
          </h2>
          <p className="font-body text-sage-600 leading-relaxed">
            We&apos;re based in Banbridge, Northern Ireland. Get in touch to book your appointment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start max-w-5xl mx-auto">
          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow-lg border border-sage-100 aspect-[4/3]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2326.5!2d-6.27!3d54.35!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s!2s16+Ballyvally+Heights%2C+Banbridge+BT32+4AG%2C+UK!5e0!3m2!1sen!2suk"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Rebalance Reflexology location — Banbridge, Northern Ireland"
            />
          </div>

          {/* Contact details */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-600">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <h3 className="font-display text-xl text-brand-900">Address</h3>
              </div>
              <p className="font-body text-sage-600 leading-relaxed pl-[52px]">
                16 Ballyvally Heights<br />
                Banbridge<br />
                BT32 4AG
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-600">
                    <rect x="2" y="3" width="20" height="18" rx="2" />
                    <path d="M22 6l-10 7L2 6" />
                  </svg>
                </div>
                <h3 className="font-display text-xl text-brand-900">Email</h3>
              </div>
              
                href="mailto:hello@rebalancereflexology.com"
                className="font-body text-brand-600 hover:text-brand-500 transition-colors pl-[52px] block"
              >
                hello@rebalancereflexology.com
              </a>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-600">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <h3 className="font-display text-xl text-brand-900">Treatment Hours</h3>
              </div>
              <div className="font-body text-sage-600 pl-[52px] space-y-1">
                <p>Tuesday: 6:00pm – 9:00pm</p>
                <p>Saturday: 10:00am – 2:00pm</p>
                <p className="text-sage-400 text-sm mt-2 italic">
                  Other times may be available — please get in touch.
                </p>
              </div>
            </div>

            <div className="pl-[52px]">
              
                href="https://www.google.com/maps/dir//16+Ballyvally+Heights,+Banbridge+BT32+4AG"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs inline-flex items-center gap-2"
              >
                Get Directions
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
