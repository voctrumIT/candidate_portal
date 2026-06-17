import AboutUsHeroSection from "@/components/AboutUs/AboutUsHeroSection";
import BuildMoreSection from "@/components/AboutUs/BuildMoreSection";
import AboutUsSection from "@/components/AboutUs/OurStorySection";
import OurStorySection from "@/components/AboutUs/OurStorySection";
import WhatDrivesUsSection from "@/components/AboutUs/WhatDrivesUsSection";
import WhyVoctrumSection from "@/components/AboutUs/WhyVoctrumSection";

export default function AboutUs() {
  return (
    <div>
      <AboutUsHeroSection />
      <OurStorySection />
      <WhatDrivesUsSection />
      <WhyVoctrumSection />
      <BuildMoreSection />
    </div>
  )
}
