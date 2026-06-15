"use client";

import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Launch Plan",
    price: "$0",
    description: "Best for individuals and small teams getting started.",
    cta: "Start Free",
    featured: false,
    features: [
      "Up to 3 team members",
      "Basic employee management",
      "Attendance tracking",
      "Simple ticketing tools",
      "Inventory overview",
      "Standard reporting",
    ],
  },
  {
    name: "Growth Plan",
    price: "$9",
    description: "Built for growing teams managing daily operations.",
    cta: "Get Started",
    featured: true,
    features: [
      "Up to 10 team members",
      "HR & workforce tools",
      "Ticketing & SLA tracking",
      "Inventory management",
      "Sales & pipeline visibility",
      "Analytics dashboard",
      "Shared workspace access",
      "Priority email support",
    ],
  },
  {
    name: "Scale Plan",
    price: "$19",
    description: "Designed for businesses that need more control.",
    cta: "Contact Sales",
    featured: false,
    features: [
      "Everything in Professional",
      "Advanced permissions",
      "Finance & treasury tools",
      "Security & access controls",
      "Workflow automation",
      "Business performance insights",
      "Integration support",
      "Priority support",
    ],
  },
];

export default function PricingHeroSection() {
  return (
    <section className="min-h-screen bg-[#f3f5ff] px-4 py-7 md:px-8">
      <nav className="mx-auto flex h-[42px] max-w-[960px] items-center justify-between rounded-full bg-white px-5 shadow-[0_20px_70px_rgba(31,53,140,0.08)]">
        <Link href="/" aria-label="Voctrum home">
          <Image
            src="/Logo.svg"
            alt="Voctrum"
            width={118}
            height={30}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-[#0d1b84] md:flex">
          <Link href="/features">Features</Link>
          <Link href="/modules">Modules</Link>
          <Link href="/resources">Resources</Link>
        </div>

        <div className="flex items-center gap-3 text-sm font-medium">
          <Link href="/login" className="hidden text-[#0d1b84] sm:inline">
            Sign In
          </Link>
          <Link
            href="/get-started"
            className="rounded-full bg-[#2493ee] px-5 py-2 text-white"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <div className="mx-auto mt-12 max-w-[960px] text-center">
        <span className="inline-flex rounded-full bg-[#456cff] px-5 py-2 text-xs font-medium text-white shadow-[0_12px_28px_rgba(69,108,255,0.24)]">
          Flexible ERP Pricing
        </span>

        <h1 className="mx-auto mt-7 max-w-[620px] text-[42px] font-bold leading-[0.98] tracking-normal text-[#172283] md:text-[56px]">
          <span className="text-[#456cff]">Scale</span> Your Operations Without
          Scaling Costs
        </h1>

        <p className="mx-auto mt-5 max-w-[455px] text-sm leading-snug text-[#6c78bd]">
          Start free, add users as you grow, and unlock powerful ERP tools when
          your business needs more control.
        </p>

        <div className="mx-auto mt-7 inline-flex h-9 items-center rounded-full border border-[#456cff] bg-white p-1 text-sm font-medium text-[#456cff]">
          <button type="button" className="h-7 rounded-full px-4">
            Monthly
          </button>
          <button
            type="button"
            className="flex h-7 items-center gap-2 rounded-full bg-[#1688ee] pl-4 pr-1.5 text-white"
          >
            Annual
            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#456cff]">
              -15% Off
            </span>
          </button>
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-[875px] items-start gap-5 md:grid-cols-[1fr_1.15fr_1fr]">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`relative flex flex-col overflow-hidden rounded-[18px] p-6 text-left ${
              plan.featured
                ? "h-[492px] bg-gradient-to-br from-[#1c51f4] via-[#062eb7] to-[#051778] text-white shadow-[0_24px_70px_rgba(17,73,214,0.28)]"
                : "mt-5 h-[428px] bg-white text-[#172283] shadow-[0_24px_70px_rgba(31,53,140,0.08)]"
            }`}
          >
            {plan.featured && (
              <span className="absolute -right-9 top-7 flex h-6 w-[130px] rotate-45 items-center justify-center bg-white text-[9px] font-bold leading-none text-[#172283] shadow-[0_8px_18px_rgba(5,23,120,0.12)]">
                Most Popular
              </span>
            )}

            <h2 className="text-base font-semibold">{plan.name}</h2>
            <p
              className={`mt-1 text-[30px] font-bold leading-none ${plan.featured ? "text-white" : "text-[#456cff]"}`}
            >
              {plan.price}
              <span className="text-[22px]"> / month</span>
            </p>
            <p
              className={`mt-3 max-w-[210px] text-xs leading-snug ${plan.featured ? "text-white/80" : "text-[#6c78bd]"}`}
            >
              {plan.description}
            </p>

            <ul className="mt-5 space-y-2.5">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className={`flex items-center gap-2.5 text-xs ${plan.featured ? "text-white" : "text-[#6c78bd]"}`}
                >
                  <Check
                    className={`h-3.5 w-3.5 shrink-0 ${plan.featured ? "text-white" : "text-[#456cff]"}`}
                  />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href={plan.name === "Scale Plan" ? "/contact" : "/get-started"}
              className={`mt-auto inline-flex h-6 w-fit items-center rounded-full px-3 text-[11px] font-semibold ${
                plan.featured
                  ? "bg-white text-[#456cff]"
                  : "bg-gradient-to-r from-[#23aaf2] to-[#08278f] text-white"
              }`}
            >
              {plan.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
