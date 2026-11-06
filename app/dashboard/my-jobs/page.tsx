"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { jobsService } from "../../../services/jobs";
import { dummyJobs } from "../../jobs/data";
import JobCard from "../../jobs/components/JobCard";
import AppliedJobCard from "./components/AppliedJobCard";
import InterviewJobCard from "./components/InterviewJobCard";
import EmptyState from "./components/EmptyState";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

type TabType = "saved" | "applied" | "interviews";

export default function MyJobsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("saved");

  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [interviewJobs, setInterviewJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const apps = await jobsService.getApplications();
        if (apps && Array.isArray(apps)) {
          setAppliedJobs(apps);
        }
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const getTabClass = (tab: TabType) => {
    const isActive = activeTab === tab;
    return `flex h-[88px] w-[140px] cursor-pointer flex-col justify-center rounded-xl border px-5 shadow-sm transition ${
      isActive
        ? "border-t-4 border-t-[#2f54eb] border-x-transparent border-b-transparent bg-[#e9edff] dark:bg-slate-800"
        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] hover:border-[#2f54eb] dark:border-slate-700 dark:bg-[#1a1a1a]"
    }`;
  };

  return (
    <div className="px-10 py-10">
      <style dangerouslySetInnerHTML={{__html: `
        .swiper-pagination-bullet {
          background-color: #d1d5db !important;
          opacity: 1 !important;
        }
        .swiper-pagination-bullet-active {
          background-color: #2f54eb !important;
        }
      `}} />
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[28px] font-black text-slate-900 dark:text-white">My Jobs</h2>
          <p className="mt-1 text-[15px] font-medium text-slate-400">
            Track your job search in one place
          </p>
        </div>
        <button className="flex h-11 items-center gap-2 rounded-lg bg-[#2f54eb] px-5 text-sm font-semibold text-white transition hover:bg-[#2447d8]">
          Explore more jobs
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Stats Row (Tabs) */}
      <div className="mt-10 flex items-center gap-6">
        <div onClick={() => setActiveTab("saved")} className={getTabClass("saved")}>
          <span className="text-[17px] font-bold text-slate-900 dark:text-white">{savedJobs.length}</span>
          <span className="mt-1 text-[13px] font-medium text-slate-500 dark:text-slate-400">Saved</span>
        </div>
        <div onClick={() => setActiveTab("applied")} className={getTabClass("applied")}>
          <span className="text-[17px] font-bold text-slate-900 dark:text-white">{appliedJobs.length}</span>
          <span className="mt-1 text-[13px] font-medium text-slate-500 dark:text-slate-400">Applied</span>
        </div>
        <div onClick={() => setActiveTab("interviews")} className={getTabClass("interviews")}>
          <span className="text-[17px] font-bold text-slate-900 dark:text-white">{interviewJobs.length}</span>
          <span className="mt-1 text-[13px] font-medium text-slate-500 dark:text-slate-400">Interviews</span>
        </div>
      </div>

      {/* Content Section: Empty States or Jobs Carousel */}
      <div className="mt-12">
        {/* Empty States */}
        {activeTab === "saved" && savedJobs.length === 0 && (
          <EmptyState 
            imageSrc="/myjobs/1.jpg" 
            title="No jobs saved yet" 
            subtitle="Jobs you save appear here" 
          />
        )}
        
        {activeTab === "applied" && appliedJobs.length === 0 && (
          <EmptyState 
            imageSrc="/myjobs/3.jpg" 
            title="No application yet" 
            subtitle="Keep track of job application here" 
          />
        )}

        {activeTab === "interviews" && interviewJobs.length === 0 && (
          <EmptyState 
            imageSrc="/myjobs/2.png" 
            title="No interviews yet" 
            subtitle="Scheduled interviews appear here" 
            showButton={false}
          />
        )}

        {/* Jobs Carousel */}
        {((activeTab === "saved" && savedJobs.length > 0) ||
          (activeTab === "applied" && appliedJobs.length > 0) ||
          (activeTab === "interviews" && interviewJobs.length > 0)) && (
          <Swiper
            key={activeTab} // Force re-render of swiper when tab changes so it resets
            modules={[Pagination, Autoplay]}
            slidesPerView={1}
            spaceBetween={24}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              900: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
            }}
            className="!pb-16"
          >
            {/* Using active jobs array depending on tab */}
            {(activeTab === "saved" ? savedJobs : activeTab === "applied" ? appliedJobs : interviewJobs).map((job, index) => {
              return (
                <SwiperSlide key={job.id} className="h-auto">
                  <div className="h-full">
                    {activeTab === "saved" && <JobCard job={job} />}
                    {activeTab === "applied" && <AppliedJobCard job={job} />}
                    {activeTab === "interviews" && (
                      <InterviewJobCard
                        job={job}
                        status={index % 2 === 0 ? "Completed" : "Pending"}
                        time={index % 2 === 0 ? "2:20 PM" : "12:15 PM"}
                        date={index % 2 === 0 ? "April 10, 2026" : "April 15, 2026"}
                        type={index % 2 === 0 ? "Online" : "Onsite"}
                      />
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </div>
  );
}
