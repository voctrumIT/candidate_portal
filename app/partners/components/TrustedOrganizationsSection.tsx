"use client";

import Image from "next/image";

const partnerLogos = [
  "/partners/1a52437216203ea59a290d673982ee7fac0f2b5e.jpg",
  "/partners/3041f319aded124433d59554ab1ef07f039e5e4e.jpg",
  "/partners/36502c23f0f4db4941c5e47a41d1e91675163d02.jpg",
  "/partners/4f640eb2b378bdc21a13f1b1b09ec35f0d8fb2a6.jpg",
  "/partners/55bd2428413573a689f9956d3e6d46e012a22fc4.jpg",
  "/partners/70e22a54ac6a325afdea0ed2a106c7842bd98be9.jpg",
  "/partners/784d25e5613c28b1e8dc845a8a03a53e6a622758.jpg",
  "/partners/80d4d10aae61cfc72f26c00702d2d890aae97930.jpg",
  "/partners/8fc4e02007ab2076f7c7ff5c669173c26b5c3e01.jpg",
  "/partners/9050fa53d0f64c0c2e9911f2f6e864cf71fa2914.jpg",
  "/partners/97de508e55f6aef59c584ab9499350fc4e5d84fd.jpg",
  "/partners/b4003363a877663630c3246cf95f8fea6989dc75.jpg"
];

export default function TrustedOrganizationsSection() {
  return (
    <section className="py-20 md:py-32 bg-white dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-[1300px] px-5 md:px-10 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Text Content */}
          <div className="flex-1 w-full max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#e9edff] dark:bg-slate-800 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-400 mb-6">
              <span className="h-2 w-2 rounded-full bg-blue-700" />
              Our Trusted Partners
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
              <span className="text-blue-600">Organizations</span><br />
              Growing with Us
            </h2>
            
            <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">
              Leading companies across multiple industries rely on our platform to streamline operations, manage talent, and drive growth
            </p>
          </div>

          {/* Right Column: Logo Grid */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
              {partnerLogos.map((logo, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center opacity-70 hover:opacity-100 transition-opacity cursor-pointer h-16 relative">
                  <Image 
                    src={logo}
                    alt={`Partner Logo ${idx + 1}`}
                    fill
                    className="object-contain dark:invert"
                  />
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
