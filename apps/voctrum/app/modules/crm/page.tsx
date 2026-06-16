import CrmHeroSection from "@/components/CrmPage/CrmHeroSection"
import CrmhowItWorks from "@/components/CrmPage/CrmhowItWorks"
import GetADemo from "@/components/CrmPage/GetADemo"
import ManageClientsSection from "@/components/CrmPage/ManageClientsSection"

export default function CrmPage() {
  return (
    <div>
      <CrmHeroSection />
      <ManageClientsSection />
      <CrmhowItWorks />
      <GetADemo />
      <section className="pointer-events-none relative z-20 -mb-[86px] h-[86px] overflow-visible bg-transparent">
        <div
          className="absolute left-1/2 -top-px z-10 h-[87px] w-[min(92vw,720px)] -translate-x-1/2 bg-[#eef2f8]"
          style={{ clipPath: "polygon(0 0, 100% 0, 74% 100%, 26% 100%)" }}
        />
      </section>
    </div>
  )
}
