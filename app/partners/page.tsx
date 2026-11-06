import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PartnersHeroSection from './components/PartnersHeroSection';
import TrustedOrganizationsSection from './components/TrustedOrganizationsSection';
import WhyPartnerSection from './components/WhyPartnerSection';

export const metadata = {
  title: 'Partners | Voctrum',
  description: 'Partner with Voctrum to find the best talent.',
};

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white">
      <Navbar />
      <PartnersHeroSection />
      <TrustedOrganizationsSection />
      <WhyPartnerSection />
      <Footer />
    </main>
  );
}
