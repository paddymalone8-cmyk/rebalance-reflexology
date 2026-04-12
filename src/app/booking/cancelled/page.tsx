import Link from 'next/link';
import Image from 'next/image';

export default function BookingCancelled() {
  return (
    <div className="min-h-screen bg-sand-50 flex flex-col">
      <header className="bg-white border-b border-sage-100">
        <div className="section-container flex items-center h-16">
          <Link href="/">
            <Image src="/logo.png" alt="Rebalance Reflexology" width={120} height={36} className="h-8 w-auto" />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-sand-100 flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2" className="text-sand-600">
              <circle cx="18" cy="18" r="12" />
              <path d="M18 12v8M18 23v1" strokeLinecap="round" />
            </svg>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl text-brand-900 font-light mb-4">
            Payment <span className="italic text-sage-600">Cancelled</span>
          </h1>

          <p className="font-body text-sage-600 leading-relaxed mb-8">
            Your booking was not completed. No payment has been taken. You&apos;re welcome to try again whenever you&apos;re ready.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/booking" className="btn-primary">
              Try Again
            </Link>
            <Link href="/" className="btn-secondary">
              Return Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
