export default function OverviewTab() {
  return (
    <div className="py-8 text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-5xl">
      
      {/* Intro Block */}
      <div className="pl-5 border-l-4 border-slate-200 dark:border-slate-700">
        <p>
          Wipro is a leading technology services and consulting company delivering innovative digital solutions to clients worldwide. With a strong focus on digital transformation, cloud computing, artificial intelligence, cybersecurity, and engineering services, we help organizations navigate complex business challenges and accelerate growth. Backed by a global workforce and a culture of innovation, Wipro is committed to creating sustainable value for clients, empowering employees through continuous learning, and driving meaningful impact across industries and communities.
        </p>
      </div>

      {/* Mission Block */}
      <div className="mt-10">
        <h3 className="text-[18px] font-bold text-slate-900 dark:text-white mb-4">
          Mission
        </h3>
        <div className="pl-5 border-l-4 border-slate-200 dark:border-slate-700">
          <p>
            To empower organizations through cutting-edge technology, innovative solutions, and digital excellence, helping them unlock new opportunities, drive meaningful change, and create long-term value for their stakeholders.
          </p>
        </div>
      </div>

      {/* Vision Block */}
      <div className="mt-10">
        <h3 className="text-[18px] font-bold text-slate-900 dark:text-white mb-4">
          Vision
        </h3>
        <div className="pl-5 border-l-4 border-slate-200 dark:border-slate-700">
          <p>
            To build a future where technology creates sustainable value for organizations and communities worldwide, enabling businesses to thrive, empowering people to succeed, and contributing to a more connected and inclusive world.
          </p>
        </div>
      </div>

    </div>
  );
}
