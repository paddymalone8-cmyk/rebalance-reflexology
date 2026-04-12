'use client';

export default function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-brand-900 text-white relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="circles" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="1" fill="white" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#circles)" />
        </svg>
      </div>

      <div className="section-container relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-px bg-brand-400" />
            <span className="font-body text-xs tracking-[0.25em] uppercase text-brand-300">What to Expect</span>
            <div className="w-8 h-px bg-brand-400" />
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light leading-tight mb-12">
            A space for you to
            <span className="italic text-brand-300"> slow down</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              {
                step: '01',
                title: 'Consultation',
                text: 'We begin with a brief conversation about your health and what you hope to gain from the session.',
              },
              {
                step: '02',
                title: 'Treatment',
                text: 'Relax in a comfortable reclining chair as precise, gentle pressure is applied to reflex points on your feet.',
              },
              {
                step: '03',
                title: 'Aftercare',
                text: 'You\'ll receive personalised aftercare advice and can book follow-up sessions to continue your journey.',
              },
            ].map((item) => (
              <div key={item.step} className="group">
                <span className="font-display text-4xl font-light text-brand-500/40 group-hover:text-brand-400/60 transition-colors">
                  {item.step}
                </span>
                <h3 className="font-display text-xl mt-3 mb-2 text-white">{item.title}</h3>
                <p className="font-body text-sm text-brand-300 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
