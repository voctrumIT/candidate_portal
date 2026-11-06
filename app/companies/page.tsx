import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CompaniesHeader from "./components/CompaniesHeader";
import IndustryFilters from "./components/IndustryFilters";
import CompanyCard from "./components/CompanyCard";
import Pagination from "../jobs/components/Pagination";
import { dummyCompanies } from "./data";

export default function CompaniesPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-20">
      <Navbar />

      <div className="mx-auto max-w-[1360px] px-5 py-12 md:px-10 lg:px-16">
        {/* Header Section */}
        <CompaniesHeader />

        {/* Industry Filters */}
        <IndustryFilters />

        {/* Companies Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          {dummyCompanies.map((company, index) => (
            // Use index in key just in case we have duplicate IDs in dummy data
            <CompanyCard key={`${company.id}-${index}`} company={company} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center">
           <Pagination />
        </div>
      </div>

      <Footer />
    </main>
  );
}
