"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

const faqs = [
  {
    question: "Can I upgrade my plan anytime?",
    answer:
      "Yes. As your business grows, you can upgrade your plan anytime to unlock additional modules, advanced capabilities, and higher operational flexibility.",
  },
  {
    question: "What modules are included in Voctrum?",
    answer:
      "Voctrum includes ERP modules for HR, attendance, ticketing, inventory, analytics, finance, and workspace operations based on your selected plan.",
  },
  {
    question: "Do you offer custom enterprise plans?",
    answer:
      "Yes. Enterprise customers can request custom pricing, dedicated onboarding, advanced security, and module configuration for their organization.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes. You can start free and explore Voctrum before choosing the plan that fits your team.",
  },
];

export default function PricingFAQs() {
  const [openItem, setOpenItem] = useState(0);

  return (
    <section className="bg-[#eef1f6] px-4 py-20 md:px-8 lg:py-24">
      <div className="mx-auto grid max-w-[960px] gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <span className="inline-flex rounded-full bg-[#456cff] px-5 py-2 text-xs font-medium text-white shadow-[0_12px_28px_rgba(69,108,255,0.24)]">
            Pricing Questions
          </span>

          <h2 className="mt-8 text-[42px] font-bold leading-[0.98] text-[#172283] md:text-[54px]">
            <span className="text-[#456cff]">Frequently</span> Asked
            <br />
            Questions
          </h2>

          <p className="mt-6 max-w-[360px] text-sm leading-snug text-[#6c78bd]">
            Everything you need to know about plans, pricing, modules, and
            getting started with Voctrum.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openItem === index;

            return (
              <article
                key={faq.question}
                className="overflow-hidden rounded-[18px] bg-white shadow-[0_20px_55px_rgba(26,40,101,0.05)]"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenItem(isOpen ? -1 : index)}
                  className="flex w-full items-start gap-5 px-6 py-6 text-left"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-[#2758ff]">
                    {isOpen ? (
                      <Minus className="h-6 w-6" strokeWidth={2.5} />
                    ) : (
                      <Plus className="h-6 w-6" strokeWidth={2.5} />
                    )}
                  </span>
                  <span className="text-sm font-bold leading-snug text-[#172283] md:text-base">
                    {faq.question}
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 pl-[70px] pr-8 text-sm leading-snug text-[#6c78bd] md:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
