import ComparePlansSection from "@/components/PricingPage/ComparePlansSection"
import PricingFAQs from "@/components/PricingPage/PricingFAQs"
import PricingHeroSection from "@/components/PricingPage/PricingHeroSection"

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <PricingHeroSection />
      <ComparePlansSection />
      <PricingFAQs />
    </main>
  )
}
