"use client";

import { useState, useRef } from "react";
import { ExternalLink, X, Mail, Phone, ChevronDown, Trash2, Plus, GraduationCap, MapPin, Banknote, Clock, Pencil, BadgeCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface ApplyButtonProps {
  jobCompany: string;
  jobTitle: string;
}

const countries = [
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+1", flag: "🇺🇸", name: "United States" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+1", flag: "🇨🇦", name: "Canada" },
];

export default function ApplyButton({ jobCompany, jobTitle }: ApplyButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);

  // Form states
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  
  // Resumes state (initially empty as requested)
  const [resumes, setResumes] = useState<{ id: number; name: string; size: string }[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep(1);
      setResumes([]); // Reset resumes on close
      setSelectedResumeId(null);
    }, 300);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeInKb = Math.round(file.size / 1024);
      const newResume = {
        id: Date.now(),
        name: file.name,
        size: `${sizeInKb}kb of ${sizeInKb}kb`,
      };
      setResumes([...resumes, newResume]);
      setSelectedResumeId(newResume.id);
      
      // Reset input value to allow uploading the same file again if deleted
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeResume = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setResumes(resumes.filter((r) => r.id !== id));
    if (selectedResumeId === id) setSelectedResumeId(null);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-11 items-center gap-2 rounded-lg bg-[#2f54eb] px-8 text-sm font-semibold text-white transition hover:bg-[#2447d8]"
      >
        Apply
        <ExternalLink className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-[600px] rounded-[16px] bg-white dark:bg-[#1a1a1a] p-8 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded bg-[#2f54eb] text-white hover:bg-[#2447d8]"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div>
              <p className="text-[15px] font-medium text-[#2f54eb]">
                Applying to {jobCompany} • {jobTitle}
              </p>
              <h2 className="mt-2 text-[22px] font-bold text-slate-900 dark:text-white">
                {step === 1 && "Contact Information"}
                {step === 2 && "Resume"}
                {step === 3 && "Additional Questions"}
                {step === 4 && "Review and Submit"}
                {step === 5 && "All Done"}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {step === 1 && "Provide your contact details so we can reach you"}
                {step === 2 && "Upload your updated resume"}
                {step === 3 && "Answer a few extra questions to help us better evaluate your application"}
                {step === 4 && "Almost done! take a moment to review your details"}
                {step === 5 && "Application under review"}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-1.5">
                {/* Step 1 indicator */}
                <div className={`h-1.5 rounded-full transition-all ${step === 1 ? "w-10 bg-[#2f54eb]" : "w-2 bg-[#2f54eb]"}`}></div>
                {/* Step 2 indicator */}
                <div className={`h-1.5 rounded-full transition-all ${step === 2 ? "w-10 bg-[#2f54eb]" : step > 2 ? "w-2 bg-[#2f54eb]" : "w-2 bg-slate-200"}`}></div>
                {/* Step 3 indicator */}
                <div className={`h-1.5 rounded-full transition-all ${step === 3 ? "w-10 bg-[#2f54eb]" : step > 3 ? "w-2 bg-[#2f54eb]" : "w-2 bg-slate-200"}`}></div>
                {/* Step 4 indicator */}
                <div className={`h-1.5 rounded-full transition-all ${step === 4 ? "w-10 bg-[#2f54eb]" : step > 4 ? "w-2 bg-[#2f54eb]" : "w-2 bg-slate-200"}`}></div>
              </div>
              {step < 5 ? (
                <span className="text-[13px] font-medium text-[#2f54eb]">Step {step} of 4</span>
              ) : (
                <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-[13px] font-medium text-[#2f54eb]">
                  4 / 4 Steps Completed
                </span>
              )}
            </div>

            {/* Step 1: Contact Information */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="mt-6 space-y-6">
                  {/* Email */}
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                      <Mail className="h-5 w-5 text-[#2f54eb]" />
                    </div>
                    <input
                      type="email"
                      placeholder="Email *"
                      className="h-12 w-full rounded-lg border border-slate-300 pl-12 pr-4 text-[15px] outline-none transition focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb]"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div className="relative flex">
                    <div className="relative">
                      <button
                        onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                        className="flex h-12 items-center gap-2 rounded-l-lg border border-r-0 border-slate-300 bg-white dark:bg-[#1a1a1a] px-4 transition hover:bg-slate-50 dark:bg-slate-900"
                      >
                        <span className="text-xl leading-none">{selectedCountry.flag}</span>
                        <span className="text-[15px] font-medium text-slate-700 dark:text-slate-300">{selectedCountry.code}</span>
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      </button>

                      {isCountryDropdownOpen && (
                        <div className="absolute left-0 top-full z-10 mt-1 w-[200px] overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] shadow-lg">
                          {countries.map((country) => (
                            <button
                              key={country.name}
                              onClick={() => {
                                setSelectedCountry(country);
                                setIsCountryDropdownOpen(false);
                              }}
                              className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50 dark:bg-slate-900"
                            >
                              <span className="text-xl leading-none">{country.flag}</span>
                              <div className="flex flex-col">
                                <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">{country.name}</span>
                                <span className="text-[12px] text-slate-500 dark:text-slate-400">{country.code}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="relative flex-1">
                      <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                        <Phone className="h-5 w-5 text-[#2f54eb]" />
                      </div>
                      <input
                        type="tel"
                        placeholder="Enter Mobile Number *"
                        className="h-12 w-full rounded-r-lg border border-slate-300 pl-12 pr-4 text-[15px] outline-none transition focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb]"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-2 text-[13px] text-slate-500 dark:text-slate-400">
                  <span className="text-slate-400">•</span>
                  <p>Your contact information will only be used for application-related communication</p>
                </div>

                <div className="mt-10 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="h-11 rounded-lg bg-[#2f54eb] px-8 text-[15px] font-semibold text-white transition hover:bg-[#2447d8]"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Resume */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="mt-6">
                  {resumes.length > 0 && <h3 className="text-lg font-bold text-slate-800">Choose a resume</h3>}

                  <div className="mt-4 space-y-4">
                    {resumes.map((resume) => {
                      const isSelected = selectedResumeId === resume.id;
                      return (
                        <div
                          key={resume.id}
                          onClick={() => setSelectedResumeId(resume.id)}
                          className={`group relative flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                            isSelected ? "border-[#2f54eb] bg-white dark:bg-[#1a1a1a] shadow-sm" : "border-transparent bg-slate-50 dark:bg-slate-900 hover:bg-slate-100"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-10 flex-col items-center justify-center rounded bg-red-500 text-white shadow-sm">
                              <span className="mt-2 text-[10px] font-bold tracking-wider">PDF</span>
                            </div>
                            <div>
                              <p className="text-[15px] font-semibold text-slate-900 dark:text-white">{resume.name}</p>
                              <p className="text-[13px] text-slate-400">{resume.size}</p>
                            </div>
                          </div>

                          <div className="flex h-12 flex-col items-end justify-between">
                            <div className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition ${isSelected ? "border-[#2f54eb]" : "border-slate-300"}`}>
                              {isSelected && <div className="h-2 w-2 rounded-full bg-[#2f54eb]"></div>}
                            </div>
                            <button 
                              onClick={(e) => removeResume(e, resume.id)}
                              className="flex h-6 w-6 items-center justify-center rounded bg-red-50 text-red-500 opacity-0 transition hover:bg-red-100 group-hover:opacity-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className={resumes.length > 0 ? "mt-6" : "mt-2"}>
                    <input 
                      type="file" 
                      accept=".doc,.docx,.pdf" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload}
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex h-11 items-center gap-2 rounded-lg border border-[#2f54eb] bg-white dark:bg-[#1a1a1a] px-5 text-[15px] font-semibold text-[#2f54eb] transition hover:bg-[#f4f7ff]"
                    >
                      <Plus className="h-5 w-5" />
                      Upload New Resume
                    </button>
                    <p className="mt-4 text-[13px] font-medium text-slate-900 dark:text-white">
                      Accepted : <span className="font-normal text-slate-400">DOC, DOCX, PDF</span> • Max 2 MB
                    </p>
                  </div>
                </div>

                <div className="mt-10 flex justify-end gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="h-11 rounded-lg border border-[#2f54eb] bg-white dark:bg-[#1a1a1a] px-8 text-[15px] font-semibold text-[#2f54eb] transition hover:bg-[#f4f7ff]"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="h-11 rounded-lg bg-[#2f54eb] px-8 text-[15px] font-semibold text-white transition hover:bg-[#2447d8]"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Additional Questions */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="mt-6 space-y-8">
                  {/* Education */}
                  <div className="relative">
                    <div className="pointer-events-none absolute bottom-3 left-0 flex items-center">
                      <GraduationCap className="h-[22px] w-[22px] text-[#2f54eb]" />
                    </div>
                    <input
                      type="text"
                      placeholder="Education *"
                      className="w-full border-b border-slate-300 bg-transparent pb-3 pl-9 text-[15px] outline-none transition focus:border-[#2f54eb] placeholder:text-slate-400"
                    />
                  </div>

                  {/* Location */}
                  <div className="relative">
                    <div className="pointer-events-none absolute bottom-3 left-0 flex items-center">
                      <MapPin className="h-[22px] w-[22px] text-[#2f54eb]" />
                    </div>
                    <input
                      type="text"
                      placeholder="Location *"
                      className="w-full border-b border-slate-300 bg-transparent pb-3 pl-9 text-[15px] outline-none transition focus:border-[#2f54eb] placeholder:text-slate-400"
                    />
                  </div>

                  {/* Expected CTC */}
                  <div className="relative">
                    <div className="pointer-events-none absolute bottom-3 left-0 flex items-center">
                      <Banknote className="h-[22px] w-[22px] text-[#2f54eb]" />
                    </div>
                    <input
                      type="text"
                      placeholder="Expected CTC Per Annum(Lakhs) *"
                      className="w-full border-b border-slate-300 bg-transparent pb-3 pl-9 text-[15px] outline-none transition focus:border-[#2f54eb] placeholder:text-slate-400"
                    />
                  </div>

                  {/* Notice Period */}
                  <div className="relative">
                    <div className="pointer-events-none absolute bottom-3 left-0 flex items-center">
                      <Clock className="h-[22px] w-[22px] text-[#2f54eb]" />
                    </div>
                    <input
                      type="text"
                      placeholder="Notice Period *"
                      className="w-full border-b border-slate-300 bg-transparent pb-3 pl-9 text-[15px] outline-none transition focus:border-[#2f54eb] placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="mt-12 flex justify-end gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="h-11 rounded-lg border border-[#2f54eb] bg-white dark:bg-[#1a1a1a] px-8 text-[15px] font-semibold text-[#2f54eb] transition hover:bg-[#f4f7ff]"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="h-11 rounded-lg bg-[#2f54eb] px-8 text-[15px] font-semibold text-white transition hover:bg-[#2447d8]"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review and Submit */}
            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="mt-6 space-y-4">
                  {/* Contact Information Review */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Contact Information</h3>
                      <button 
                        onClick={() => setStep(1)}
                        className="flex h-7 w-7 items-center justify-center rounded bg-[#2f54eb] text-white transition hover:bg-[#2447d8]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between text-[14px]">
                        <span className="text-slate-500 dark:text-slate-400">Email</span>
                        <span className="font-medium text-slate-400">hidayatam041@gmail.com</span>
                      </div>
                      <div className="flex items-center justify-between text-[14px]">
                        <span className="text-slate-500 dark:text-slate-400">Phone</span>
                        <span className="font-medium text-slate-400">8899451482</span>
                      </div>
                    </div>
                  </div>

                  {/* Resume Review */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Resume</h3>
                      <button 
                        onClick={() => setStep(2)}
                        className="flex h-7 w-7 items-center justify-center rounded bg-[#2f54eb] text-white transition hover:bg-[#2447d8]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-[14px]">
                        <span className="text-slate-500 dark:text-slate-400">File</span>
                        <div className="flex items-center gap-1.5 font-medium text-slate-400">
                          <div className="flex h-4 w-3.5 items-center justify-center rounded-[2px] bg-red-500 text-white">
                            <span className="text-[5px] font-bold leading-none tracking-tighter">PDF</span>
                          </div>
                          hidayat.PDF
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Questions Review */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Additional Questions</h3>
                      <button 
                        onClick={() => setStep(3)}
                        className="flex h-7 w-7 items-center justify-center rounded bg-[#2f54eb] text-white transition hover:bg-[#2447d8]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between text-[14px]">
                        <span className="text-slate-500 dark:text-slate-400">Education</span>
                        <span className="font-medium text-slate-400">Btech computer science</span>
                      </div>
                      <div className="flex items-center justify-between text-[14px]">
                        <span className="text-slate-500 dark:text-slate-400">Location</span>
                        <span className="font-medium text-slate-400">Srinagar, Jammu & Kashmir</span>
                      </div>
                      <div className="flex items-center justify-between text-[14px]">
                        <span className="text-slate-500 dark:text-slate-400">Expected CTC Per Annum(Lakhs)</span>
                        <span className="font-medium text-slate-400">₹ 7.5</span>
                      </div>
                      <div className="flex items-center justify-between text-[14px]">
                        <span className="text-slate-500 dark:text-slate-400">Notice Period</span>
                        <span className="font-medium text-slate-400">1 month</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                  <button
                    onClick={() => setStep(3)}
                    className="h-11 rounded-lg border border-[#2f54eb] bg-white dark:bg-[#1a1a1a] px-8 text-[15px] font-semibold text-[#2f54eb] transition hover:bg-[#f4f7ff]"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(5)}
                    className="h-11 rounded-lg bg-[#2f54eb] px-8 text-[15px] font-semibold text-white transition hover:bg-[#2447d8]"
                  >
                    Submit Application
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Success / All Done */}
            {step === 5 && (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <div className="mt-12 flex flex-col items-center justify-center text-center">
                  <BadgeCheck className="h-[100px] w-[100px] text-white" fill="#74b347" strokeWidth={1.5} />
                  <h3 className="mt-6 text-[22px] font-bold text-slate-900 dark:text-white">Application Submitted</h3>
                  <p className="mx-auto mt-2 max-w-[400px] text-[15px] leading-relaxed text-slate-500 dark:text-slate-400">
                    We'll review your application and notify you of updates. You can keep track of your application in the "Applied" tab of My Jobs
                  </p>
                </div>
                <div className="mt-12 flex justify-end border-t border-slate-200 dark:border-slate-700 pt-6">
                  <button
                    onClick={() => {
                      handleClose();
                      router.push("/dashboard/jobs");
                    }}
                    className="h-11 rounded-lg bg-[#2f54eb] px-8 text-[15px] font-semibold text-white transition hover:bg-[#2447d8]"
                  >
                    Explore More Jobs
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
