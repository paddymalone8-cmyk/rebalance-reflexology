'use client';

export default function FindUs() {
  return (
    <section id="find-us" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-brand-900 font-light leading-tight mb-4">
            Find <span className="italic text-brand-600">Us</span>
          </h2>
          <p className="font-body text-sage-600 leading-relaxed">
            Based in Banbridge, Northern Ireland.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-start max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-sage-100 aspect-[4/3]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2326.5!2d-6.27!3d54.35!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s!2s16+Ballyvally+Heights%2C+Banbridge+BT32+4AG%2C+UK!5e0!3m2!1sen!2suk"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Rebalance Reflexology location"
            />
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="font-display text-xl text-brand-900 mb-2">Address</h3>
              <p className="font-body text-sage-600 leading-relaxed">
                16 Ballyvally Heights<br />
                Banbridge<br />
                BT32 4AG
              </p>
            </div>
            <div>
              <h3 className="font-display text-xl text-brand-900 mb-2">Email</h3>
              <a href="mailto:hello@rebalancereflexology.com" className="font-body text-brand-600 hover:text-brand-500 transition-colors">
                hello@rebalancereflexology.com
              </a>
            </div>
            <div>
              <h3 className="font-display text-xl text-brand-900 mb-2">Treatment Hours</h3>
              <div className="font-body text-sage-600 space-y-1">
                <p>Tuesday: 6:00pm - 9:00pm</p>
                <p>Saturday: 10:00am - 2:00pm</p>
              </div>
            </div>
            
              href="https://www.google.com/maps/dir//16+Ballyvally+Heights,+Banbridge+BT32+4AG"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs inline-flex items-center gap-2"
            >
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
