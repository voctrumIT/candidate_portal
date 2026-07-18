"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqsLeft = [
  {
    question: "How do I apply for a job?",
    answer:
      "Browse available opportunities, select a job that matches your skills and interests, and click Apply Now to submit your application. Before applying, ensure your profile and resume are up to date. Once submitted, you can track your application status directly from your dashboard.",
  },
  {
    question: "I forgot my password. What should I do?",
    answer:
      "Click on the 'Forgot Password' link on the login page. Enter your registered email address, and we will send you a secure OTP to reset your password and regain access to your account.",
  },
];

const faqsRight = [
  {
    question: "How can I track my applications?",
    answer:
      "You can track all your applications by navigating to the 'My Jobs' or 'Applications' section in your dashboard. Here you will see real-time status updates for each role you've applied to.",
  },
  {
    question: "How do I upload or update my resume?",
    answer:
      "Go to your Profile settings and navigate to the Resume section. You can upload a new PDF or DOCX file, or delete an existing one. We recommend keeping it updated to improve your match rate.",
  },
  {
    question: "How do I upload or update my resume?",
    answer:
      "Go to your Profile settings and navigate to the Resume section. You can upload a new PDF or DOCX file, or delete an existing one. We recommend keeping it updated to improve your match rate.",
  },
];

function FAQItem({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] shadow-sm overflow-hidden transition-all">
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none"
      >
        <span className={`text-[15px] font-bold ${isOpen ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
          {question}
        </span>
        <span className="ml-4 flex shrink-0 items-center justify-center text-blue-600">
          {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </span>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<string>("l-0");

  return (
    <section className="py-20 bg-white dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-[1100px] px-5 md:px-10 lg:px-16">
        
        <div className="text-center mb-14">
          <div className="mb-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-blue-600">
            &rarr; COMMON QUESTIONS
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Frequently Asked <span className="text-blue-600">Questions</span>
          </h2>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Quick answers to the most common questions from job seekers and employers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          <div className="flex flex-col gap-6">
            {faqsLeft.map((faq, idx) => {
              const id = `l-${idx}`;
              return (
                <FAQItem
                  key={id}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === id}
                  onClick={() => setOpenIndex(openIndex === id ? "" : id)}
                />
              );
            })}
          </div>

          <div className="flex flex-col gap-6">
            {faqsRight.map((faq, idx) => {
              const id = `r-${idx}`;
              return (
                <FAQItem
                  key={id}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === id}
                  onClick={() => setOpenIndex(openIndex === id ? "" : id)}
                />
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
