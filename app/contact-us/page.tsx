import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactHeroAndForm from './components/ContactHeroAndForm';
import WhyReachOutSection from './components/WhyReachOutSection';

export const metadata = {
  title: 'Contact Us | Voctrum',
  description: 'Get the right support, faster. We are here to help.',
};

export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white">
      {/* We pass a prop or rely on the global Navbar. Let's wrap Navbar in a way that it sits over the blue bg if necessary, but the design shows the blue bg starts right at the top. 
          Assuming Navbar handles its own transparent/white bg. Our layout will just follow it. */}
      <Navbar />
      <ContactHeroAndForm />
      <WhyReachOutSection />
      <Footer />
    </main>
  );
}
