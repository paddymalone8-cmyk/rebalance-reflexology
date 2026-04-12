import Link from 'next/link';
import Image from 'next/image';

export default function BookingSuccess() {
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
          {/* Success icon */}
          <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-brand-100 flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-brand-700">
              <path d="M8 18l7 7 13-13" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl text-brand-900 font-light mb-4">
            Booking <span className="italic text-brand-600">Confirmed</span>
          </h1>

          <p className="font-body text-sage-600 leading-relaxed mb-2">
            Thank you for booking with Rebalance Reflexology. Your appointment has been confirmed.
          </p>
          <p className="font-body text-sm text-sage-500 mb-8">
            A confirmation email with your appointment details has been sent to your inbox.
          </p>

          <Link href="/" className="btn-primary">
            Return to Homepage
          </Link>
        </div>
      </main>
    </div>
  );
}
