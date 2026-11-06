import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelpHeroSection from './components/HelpHeroSection';
import SupportCategoriesSection from './components/SupportCategoriesSection';
import AISupportSection from './components/AISupportSection';
import FAQSection from './components/FAQSection';
import HelpCTASection from './components/HelpCTASection';

export const metadata = {
  title: 'Help Center | Voctrum',
  description: 'Find answers, explore helpful resources, and get support.',
};

export default function HelpCenterPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white">
      <Navbar />
      <HelpHeroSection />
      <SupportCategoriesSection />
      <AISupportSection />
      <FAQSection />
      <HelpCTASection />
      <Footer />
    </main>
  );
}
