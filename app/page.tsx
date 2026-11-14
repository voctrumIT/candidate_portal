import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturedJobListings from './components/FeaturedJobListings';
import ResumeBuilderSection from './components/ResumeBuilderSection';
import EasyStepsSection from './components/EasyStepsSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="pt-20">
      <Navbar />
      <HeroSection />
      <FeaturedJobListings />
      <ResumeBuilderSection />
      <EasyStepsSection />
      <Footer />
    </main>
  );
}
