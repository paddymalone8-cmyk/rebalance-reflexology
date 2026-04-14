"use client";

import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl opacity-60" />

      <div className="section-container relative z-10">
        {/* About Reflexology */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-brand-100 via-brand-50 to-sand-100 relative overflow-hidden">
              <svg
                viewBox="0 0 400 500"
                className="absolute inset-0 w-full h-full p-12 text-brand-600/20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse cx="200" cy="300" rx="80" ry="120" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="155" cy="195" r="18" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="185" cy="180" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="215" cy="180" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="242" cy="195" r="17" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="260" cy="218" r="14" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="200" cy="260" r="25" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="4 4" />
                <circle cx="200" cy="310" r="30" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="4 4" />
                <circle cx="200" cy="370" r="22" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="4 4" />
                <path d="M200 180 Q180 240 200 300 Q220 360 200 420" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.5" />
                <path d="M170 200 Q160 280 180 360" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                <path d="M230 200 Q240 280 220 360" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
              </svg>
              <div className="absolute top-8 left-8 w-3 h-3 rounded-full bg-brand-400/30 animate-float" />
              <div className="absolute bottom-12 right-12 w-4 h-4 rounded-full bg-sand-400/30 animate-float" style={{ animationDelay: "2s" }} />
              <div className="absolute top-1/3 right-8 w-2 h-2 rounded-full bg-brand-300/40 animate-float" style={{ animationDelay: "4s" }} />
            </div>
          </div>

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
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                { icon: "\u2726", label: "Stress Relief" },
                { icon: "\u2726", label: "Better Sleep" },
                { icon: "\u2726", label: "Pain Management" },
                { icon: "\u2726", label: "Deep Relaxation" },
              ].map((benefit) => (
                <div key={benefit.label} className="flex items-center gap-2.5">
                  <span className="text-brand-500 text-xs">{benefit.icon}</span>
                  <span className="font-body text-sm text-brand-800">{benefit.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* About Joanne */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-brand-500" />
              <span className="font-body text-xs tracking-[0.25em] uppercase text-brand-600">About Us</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-brand-900 font-light leading-tight mb-6">
              About <span className="italic text-brand-600">Joanne</span>
            </h2>
            <div className="space-y-4 font-body text-sage-600 leading-relaxed">
              <p>
                Joanne is the founder of Rebalance Reflexology, a boutique reflexology studio in
                Banbridge, offering a calm, luxurious space designed to help you unwind, rebalance,
                and restore.
              </p>
              <p>
                With over 15 years&apos; experience as a qualified pharmacist, Joanne brings a unique
                blend of clinical expertise and holistic care to her practice. Her in-depth
                understanding of the body, combined with a genuine passion for wellbeing, allows her
                to deliver treatments that are both therapeutic and deeply restorative.
              </p>
              <p>
                Joanne&apos;s journey into reflexology is profoundly personal. Following a brain tumour
                diagnosis in 2004 and ongoing treatment, she discovered reflexology during her own
                healing journey. Experiencing its powerful benefits firsthand &mdash; including deep
                relaxation, stress relief, and a renewed sense of balance &mdash; inspired her to
                train professionally and offer the same support to others.
              </p>
              <p>
                Today, Joanne is a fully qualified reflexologist, specialising in reflexology for
                relaxation, stress management, and overall wellbeing in Banbridge and the surrounding
                areas. She offers treatments from her beautifully designed private home studio,
                providing a peaceful, one-to-one environment where clients can truly switch off.
              </p>
              <p>
                At Rebalance Reflexology, Joanne warmly welcomes those seeking reflexology in
                Banbridge, holistic therapy near Banbridge, and a more personalised, premium approach
                to wellbeing. Each session is thoughtfully tailored to the individual, ensuring a
                deeply calming and restorative experience from the moment you arrive.
              </p>
              <p>
                Whether you are looking to reduce stress, support your wellbeing, or simply take time
                to recharge, Joanne offers a space where your wellbeing is the priority.
              </p>
            </div>
            <div className="mt-8">
              <Link href="/booking" className="btn-primary">
                Book Your Session in Banbridge
              </Link>
            </div>
          </div>

          <div className="order-1 md:order-2 relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden relative shadow-lg">
              <Image
                src="/joanne.jpg"
                alt="Joanne - Reflexologist and founder of Rebalance Reflexology in Banbridge"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-lg p-6 max-w-[220px] border border-sage-100">
              <p className="font-display text-3xl text-brand-700 font-semibold">15+</p>
              <p className="font-body text-xs text-sage-600 mt-1">Years of healthcare expertise</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
