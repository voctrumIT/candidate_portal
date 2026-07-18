"use client";

import { useState } from "react";
import CompanyTabs from "./CompanyTabs";
import OverviewTab from "./OverviewTab";
import JobsTab from "./JobsTab";
import ReviewsTab from "./ReviewsTab";
import BenefitsTab from "./BenefitsTab";

export default function CompanyContentManager() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <>
      <CompanyTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="mx-auto max-w-[1360px] px-5 pb-20 md:px-10 lg:px-16">
        {activeTab === "Overview" && <OverviewTab />}
        {activeTab === "Jobs" && <JobsTab />}
        {activeTab === "Reviews" && <ReviewsTab />}
        {activeTab === "Benefits" && <BenefitsTab />}
      </div>
    </>
  );
}
