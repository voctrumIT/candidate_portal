"use client"

import Image from "next/image"

const contactInfo = [
  { icon: "/ContactUsIcon1.svg", label: "Office", value: "Srinagar, J&K" },
  { icon: "/ContactUsIcon2.svg", label: "Phone", value: "+91 6005100663" },
  { icon: "/ContactUsIcon3.svg", label: "Timings", value: "9:30AM - 10:00PM" },
  { icon: "/ContactUsIcon4.svg", label: "Email", value: "hr@voctrum.com" },
]

const subjectOptions = ["Use it in my company", "Partnership", "General Inquiry", "Support"]
const companySizes = ["1-10", "11-50", "51-200", "201-500", "500+"]

export default function ContactUsHeroSection() {
  return (
    <section className="bg-white px-5 py-16 pt-25 sm:px-10">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">

        {/* Left */}
        <div className="pt-4">
          <span className="inline-flex rounded-full bg-[#456cff] text-white px-4 py-1.5 text-[11px] font-semibold text-[#456cff]">
            Contact Voctrum
          </span>

          <h1 className="mt-5 text-[42px] font-extrabold leading-tight text-[#172283] sm:text-[52px]">
            <span className="text-[#456cff]">Let's</span>
            <br />
            Talk Business
          </h1>

          <p className="mt-4 max-w-[300px] text-[13px] leading-relaxed text-[#6d7fc4]">
            Tell us what your team needs, and we'll help you explore the right Voctrum modules, plan, and setup.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {contactInfo.map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 rounded-[14px] border border-[#e8edf6] px-4 py-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px]">
                  <Image src={icon} alt={label} width={38} height={38} />
                </span>
                <div>
                  <p className="text-[11px] font-bold text-[#172283]">{label}</p>
                  <p className="text-[10px] text-[#6d7fc4]">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3">
            <span className="text-[13px] font-semibold text-[#172283]">Social Media :</span>
            {[
              { icon: "/ContactUsIcon5.svg" },
              { icon: "/ContactUsIcon6.svg" },
              { icon: "/ContactUsIcon7.svg" },
              { icon: "/ContactUsIcon8.svg" },
            ].map(({ icon }, idx) => (
              <a
                key={idx}
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full"
              >
                <Image src={icon} alt="social" width={28} height={28} />
              </a>
            ))}
          </div>
        </div>

        {/* Right — form card */}
        <div className="rounded-[24px] border border-[#e8edf6] bg-white px-8 py-8 shadow-[0_20px_60px_rgba(8,38,118,0.08)]">
          <h2 className="text-[22px] font-bold text-[#172283]">Contact Us</h2>
          <p className="mb-6 text-[12px] text-[#9ca8cc]">Looking for something</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-[#172283]">Name<span className="text-[#456cff]">*</span></label>
              <input className="w-full rounded-[10px] border border-[#e8edf6] px-3 py-2 text-[12px] text-[#172283] outline-none placeholder:text-[#c5ccd8] focus:border-[#456cff]" placeholder="Ali Javaid" />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-[#172283]">Phone Number</label>
              <input className="w-full rounded-[10px] border border-[#e8edf6] px-3 py-2 text-[12px] text-[#172283] outline-none placeholder:text-[#c5ccd8] focus:border-[#456cff]" placeholder="+91" />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-[#172283]">Email<span className="text-[#456cff]">*</span></label>
              <input className="w-full rounded-[10px] border border-[#e8edf6] px-3 py-2 text-[12px] text-[#172283] outline-none placeholder:text-[#c5ccd8] focus:border-[#456cff]" placeholder="example@mail.com" />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-[#172283]">Company</label>
              <input className="w-full rounded-[10px] border border-[#e8edf6] px-3 py-2 text-[12px] text-[#172283] outline-none placeholder:text-[#c5ccd8] focus:border-[#456cff]" placeholder="ACME Corp" />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-[11px] font-semibold text-[#172283]">Subject<span className="text-[#456cff]">*</span></label>
            <select className="w-full rounded-[10px] border border-[#e8edf6] px-3 py-2 text-[12px] text-[#172283] outline-none focus:border-[#456cff]">
              {subjectOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-[11px] font-semibold text-[#172283]">Your company size<span className="text-[#456cff]">*</span></label>
            <select className="w-full rounded-[10px] border border-[#e8edf6] px-3 py-2 text-[12px] text-[#172283] outline-none focus:border-[#456cff]">
              <option value="">Select</option>
              {companySizes.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-[11px] font-semibold text-[#172283]">Message<span className="text-[#456cff]">*</span></label>
            <textarea
              rows={5}
              className="w-full resize-none rounded-[10px] border border-[#e8edf6] px-3 py-2 text-[12px] text-[#172283] outline-none placeholder:text-[#c5ccd8] focus:border-[#456cff]"
              placeholder="Write down your message"
            />
          </div>

          <p className="mt-3 text-[11px] text-[#456cff]">We typically respond within 1-2 business days.</p>

          <button className="mt-4 w-full rounded-[10px] bg-[linear-gradient(90deg,#2aa8f5,#09268f)] py-3 text-[13px] font-semibold text-white transition-opacity hover:opacity-90">
            Talk to us
          </button>
        </div>

      </div>
    </section>
  )
}
