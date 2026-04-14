"use client";

import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-sand-50 via-brand-50 to-sage-50" />

      <div className="absolute top-20 right-10 w-72 h-72 bg-brand-200/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-sand-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-100/10 rounded-full blur-3xl" />

      <svg className="absolute top-0 left-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <circle cx="40" cy="40" r="0.5" fill="#1a5c4f" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div className="relative z-10 section-container text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in">
            <div className="w-12 h-px bg-brand-400" />
            <span className="font-body text-xs tracking-[0.3em] uppercase text-brand-600">Northern Ireland</span>
            <div className="w-12 h-px bg-brand-400" />
          </div>

          <div
            className="mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}
          >
            <Image
              src="/logo.png"
              alt="Rebalance Reflexology"
              width={600}
              height={200}
              className="mx-auto w-full max-w-lg h-auto"
              priority
            />
          </div>

          <p
            className="font-body text-lg sm:text-xl text-sage-600 max-w-lg mx-auto mb-4 leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.4s", animationFillMode: "backwards" }}
          >
            Find your balance. Restore your wellbeing.
          </p>

          <p
            className="font-body text-sm text-sage-500 max-w-md mx-auto mb-10 leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.5s", animationFillMode: "backwards" }}
          >
            Professional reflexology treatments designed to promote deep relaxation and support your body&apos;s natural healing.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.6s", animationFillMode: "backwards" }}
          >
            <Link href="/booking" className="btn-primary">
              Book Your Session
            </Link>
            <a href="#about" className="btn-secondary">
              Learn More
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse-soft">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-brand-400">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
