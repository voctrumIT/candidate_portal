"use client";

import CompaniesHeader from "../../companies/components/CompaniesHeader";
import IndustryFilters from "../../companies/components/IndustryFilters";
import CompanyCard from "../../companies/components/CompanyCard";
import Pagination from "../../jobs/components/Pagination";
import { dummyCompanies } from "../../companies/data";

export default function DashboardCompaniesPage() {
  return (
    <div className="px-10 py-7">
      {/* Header Section */}
      <CompaniesHeader />

      {/* Industry Filters */}
      <IndustryFilters />

      {/* Companies Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {dummyCompanies.map((company, index) => (
          <CompanyCard key={`${company.id}-${index}`} company={company} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-12 flex justify-center">
         <Pagination />
      </div>
    </div>
  );
}
