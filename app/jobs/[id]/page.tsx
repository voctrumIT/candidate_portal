import { notFound } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import JobCard from '../components/JobCard';
import JobDetailHeader from './components/JobDetailHeader';
import JobDetailContent from './components/JobDetailContent';
import { dummyJobs } from '../data';
import Link from 'next/link';

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = dummyJobs.find((j) => j.id === id);

  if (!job) {
    notFound();
  }

  // Get some similar jobs (excluding the current one)
  const similarJobs = dummyJobs.filter((j) => j.id !== id).slice(0, 3);

  return (
    <main className="pt-20 bg-white">
      <Navbar />

      <div className="mx-auto max-w-[960px] px-5 pt-12 md:px-10 lg:px-16">
        <JobDetailHeader job={job} />
        <JobDetailContent job={job} />
      </div>

      {/* Similar Jobs Section */}
      <div className="mx-auto max-w-[1360px] px-5 py-16 md:px-10 lg:px-16 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Similar Jobs</h2>
            <p className="mt-1 text-[14px] text-slate-500">
              Explore more opportunities that match your profile and interests.
            </p>
          </div>
          <Link
            href="/jobs"
            className="text-[14px] font-semibold text-slate-900 underline transition hover:text-blue-700"
          >
            View all
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {similarJobs.map((similarJob) => (
            <JobCard key={similarJob.id} job={similarJob} />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
