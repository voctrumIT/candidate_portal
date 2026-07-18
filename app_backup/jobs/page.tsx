import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JobSearchHero from './components/JobSearchHero';
import CategoryPills from './components/CategoryPills';
import JobCard from './components/JobCard';
import Pagination from './components/Pagination';
import { dummyJobs } from './data';

export default function JobsPage() {
  return (
    <main className="pt-20 bg-[#fefefe]">
      <Navbar />
      
      <JobSearchHero />
      <CategoryPills />

      {/* Jobs Grid */}
      <div className="mx-auto mt-10 max-w-[1360px] px-5 md:px-10 lg:px-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dummyJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>

      <Pagination />
      
      <Footer />
    </main>
  );
}
