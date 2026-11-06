import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import HighDemandJobCategories from './components/HighDemandJobCategories';
import FeaturedJobListings from './components/FeaturedJobListings';
import TopCompaniesHiring from './components/TopCompaniesHiring';
import CompaniesHiringOnPlatform from './components/CompaniesHiringOnPlatform';
import ResumeBuilderSection from './components/ResumeBuilderSection';
import EasyStepsSection from './components/EasyStepsSection';
import TestimonialsAppSection from './components/TestimonialsAppSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="pt-20">
      <Navbar />
      <HeroSection />
      <HighDemandJobCategories />
      <FeaturedJobListings />
      <TopCompaniesHiring />
      <CompaniesHiringOnPlatform />
      <ResumeBuilderSection />
      <EasyStepsSection />
      <TestimonialsAppSection />
      <Footer />
    </main>
  );
}
