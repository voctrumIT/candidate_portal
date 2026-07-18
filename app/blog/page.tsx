import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogHeroSection from './components/BlogHeroSection';
import FeaturedArticle from './components/FeaturedArticle';
import LatestArticles from './components/LatestArticles';

export const metadata = {
  title: 'Blog | Voctrum',
  description: 'Insights that help you grow professionally.',
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white">
      <Navbar />
      <BlogHeroSection />
      <div className="bg-[#f8f8f9] dark:bg-slate-900/40">
        <FeaturedArticle />
      </div>
      <LatestArticles />
      <Footer />
    </main>
  );
}
