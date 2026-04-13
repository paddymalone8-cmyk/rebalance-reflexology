import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/ui/Hero';
import About from '@/components/ui/About';
import Services from '@/components/ui/Services';
import Testimonials from '@/components/ui/Testimonials';
import FindUs from '@/components/ui/FindUs';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Testimonials />
        <FindUs />
      </main>
      <Footer />
    </>
  );
}
