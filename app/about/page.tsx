import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AboutHeroSection from './components/AboutHeroSection';
import WhatWeOfferSection from './components/WhatWeOfferSection';
import WhyChooseUsSection from './components/WhyChooseUsSection';

export const metadata = {
  title: 'About Us | Voctrum',
  description: 'Learn how Voctrum connects talent with better opportunities.',
};

export default function AboutPage() {
  return (
    <main className="pt-20">
      <Navbar />
      <AboutHeroSection />
      <WhatWeOfferSection />
      <WhyChooseUsSection />
      <Footer />
    </main>
  );
}
