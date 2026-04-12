'use client';

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl opacity-60" />

      <div className="section-container relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left — visual element */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-brand-100 via-brand-50 to-sand-100 relative overflow-hidden">
              {/* Decorative SVG illustration */}
              <svg
                viewBox="0 0 400 500"
                className="absolute inset-0 w-full h-full p-12 text-brand-600/20"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Foot outline */}
                <ellipse cx="200" cy="300" rx="80" ry="120" fill="none" stroke="currentColor" strokeWidth="1.5" />
                {/* Toes */}
                <circle cx="155" cy="195" r="18" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="185" cy="180" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="215" cy="180" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="242" cy="195" r="17" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="260" cy="218" r="14" fill="none" stroke="currentColor" strokeWidth="1" />
                {/* Reflex zones */}
                <circle cx="200" cy="260" r="25" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="4 4" />
                <circle cx="200" cy="310" r="30" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="4 4" />
                <circle cx="200" cy="370" r="22" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="4 4" />
                {/* Energy lines */}
                <path d="M200 180 Q180 240 200 300 Q220 360 200 420" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.5" />
                <path d="M170 200 Q160 280 180 360" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                <path d="M230 200 Q240 280 220 360" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
              </svg>

              {/* Floating accent dots */}
              <div className="absolute top-8 left-8 w-3 h-3 rounded-full bg-brand-400/30 animate-float" />
              <div className="absolute bottom-12 right-12 w-4 h-4 rounded-full bg-sand-400/30 animate-float" style={{ animationDelay: '2s' }} />
              <div className="absolute top-1/3 right-8 w-2 h-2 rounded-full bg-brand-300/40 animate-float" style={{ animationDelay: '4s' }} />
            </div>

            {/* Offset card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-lg p-6 max-w-[200px] border border-sage-100">
              <p className="font-display text-3xl text-brand-700 font-semibold">10+</p>
              <p className="font-body text-xs text-sage-600 mt-1">Years of professional practice</p>
            </div>
          </div>

          {/* Right — text */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-brand-500" />
              <span className="font-body text-xs tracking-[0.25em] uppercase text-brand-600">About Reflexology</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-brand-900 font-light leading-tight mb-6">
              Healing through
              <span className="italic text-brand-600"> gentle touch</span>
            </h2>

            <div className="space-y-4 font-body text-sage-600 leading-relaxed">
              <p>
                Reflexology is a complementary therapy based on the principle that areas on the feet
                correspond to different organs and systems of the body. By applying gentle pressure
                to these reflex points, reflexology can help reduce stress, improve circulation, and
                encourage the body&apos;s natural healing processes.
              </p>
              <p>
                At Rebalance Reflexology, each session is tailored to your individual needs. Whether
                you&apos;re seeking relief from tension, support during a difficult time, or simply a
                moment of deep relaxation, you&apos;re in caring and experienced hands.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                { icon: '✦', label: 'Stress Relief' },
                { icon: '✦', label: 'Better Sleep' },
                { icon: '✦', label: 'Pain Management' },
                { icon: '✦', label: 'Deep Relaxation' },
              ].map((benefit) => (
                <div key={benefit.label} className="flex items-center gap-2.5">
                  <span className="text-brand-500 text-xs">{benefit.icon}</span>
                  <span className="font-body text-sm text-brand-800">{benefit.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
