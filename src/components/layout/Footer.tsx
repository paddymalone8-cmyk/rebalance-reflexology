import Image from 'next/image';

export default function Footer() {
  return (
    <footer id="contact" className="bg-brand-950 text-brand-200">
      <div className="section-container py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <Image src="/logo.png" alt="Rebalance Reflexology" width={140} height={42} className="h-9 w-auto brightness-200 mb-4" />
            <p className="text-brand-400 text-sm leading-relaxed max-w-xs">
              Professional reflexology treatments in Northern Ireland. Helping you find balance and restore wellbeing.
            </p>
          </div>

          <div>
            <h4 className="font-display text-lg text-white mb-4">Get In Touch</h4>
            <div className="space-y-2 text-sm text-brand-300">
              <p>Northern Ireland</p>
              <p>
                <a href="mailto:hello@rebalancereflexology.com" className="hover:text-white transition-colors">
                  hello@rebalancereflexology.com
                </a>
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg text-white mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <a href="#about" className="block text-brand-300 hover:text-white transition-colors">About Reflexology</a>
              <a href="#services" className="block text-brand-300 hover:text-white transition-colors">Services &amp; Pricing</a>
              <a href="/booking" className="block text-brand-300 hover:text-white transition-colors">Book Appointment</a>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-800 mt-12 pt-8 text-center text-xs text-brand-500">
          <p>&copy; {new Date().getFullYear()} Rebalance Reflexology. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
