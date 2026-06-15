import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const rows = [
  ["Users", "3", "10", "Unlimited"],
  ["Core Modules", true, true, true],
  ["Ticketing", "Basic", true, true],
  ["Inventory", "Basic", true, true],
  ["HRM", "Basic", true, true],
  ["Finance", "-", "Basic", "Advanced"],
  ["Analytics", "Basic", "Standard", "Advanced"],
  ["Role-Based Access", "-", true, true],
  ["Automation", "-", "Basic", "Advanced"],
  ["Support", "Email", "Standard", "Priority"],
] as const;

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#3c9a4b] text-white">
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    );
  }

  return <span>{value}</span>;
}

export default function ComparePlansSection() {
  return (
    <section className="bg-[#f3f5ff] px-4 py-16 md:px-8">
      <div className="mx-auto max-w-[960px] overflow-x-auto rounded-[28px] border border-[#dbe4ff] bg-white/40 px-2 pb-2 pt-0">
        <div className="min-w-[820px] px-6 py-8">
          <div className="grid grid-cols-[1.15fr_1fr_1fr_1fr] items-center gap-6 rounded-[24px] border border-[#dbe4ff] bg-white/55 px-0 py-6">
            <div className="pl-0">
              <h2 className="text-[42px] font-bold leading-[0.98] text-[#172283]">
                Compare
                <br />
                <span className="text-[#456cff]">Plans</span>
              </h2>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-[#172283]">Free</h3>
              <Link
                href="/get-started"
                className="mt-3 inline-flex h-9 items-center rounded-full border border-[#456cff] px-4 text-sm font-medium text-[#456cff]"
              >
                Start Free
              </Link>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-[#172283]">Plus</h3>
              <Link
                href="/get-started"
                className="mt-3 inline-flex h-9 items-center gap-3 rounded-full bg-gradient-to-r from-[#2ca9f2] to-[#07309d] pl-5 pr-1.5 text-sm font-medium text-white"
              >
                Get Started
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#0d1b84]">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-[#172283]">
                Enterprise
              </h3>
              <Link
                href="/contact"
                className="mt-3 inline-flex h-9 items-center rounded-full border border-[#456cff] px-4 text-sm font-medium text-[#456cff]"
              >
                Contact Sales
              </Link>
            </div>
          </div>

          <div className="mt-3">
            {rows.map(([feature, free, plus, enterprise]) => (
              <div
                key={feature}
                className="grid min-h-[50px] grid-cols-[1.15fr_1fr_1fr_1fr] items-center gap-6 border-b border-[#d8d8dd] text-sm text-[#626eb1]"
              >
                <div className="font-semibold text-[#172283]">{feature}</div>
                <div>
                  <CellValue value={free} />
                </div>
                <div>
                  <CellValue value={plus} />
                </div>
                <div>
                  <CellValue value={enterprise} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
