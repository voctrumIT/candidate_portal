import { TrendingUp, Activity, BadgeDollarSign, Users, GraduationCap, CalendarDays } from "lucide-react";

export default function BenefitsTab() {
  const benefits = [
    {
      title: "Career Growth",
      description: "Access to training programs, certifications, mentorship, and continuous learning opportunities.",
      icon: TrendingUp,
    },
    {
      title: "Health & Wellness",
      description: "Comprehensive healthcare plans and wellness initiatives to support employees and their families.",
      icon: Activity,
    },
    {
      title: "Performance Rewards",
      description: "Competitive compensation packages, bonuses, and recognition programs.",
      icon: BadgeDollarSign,
    },
    {
      title: "Team Engagement",
      description: "Regular events, celebrations, and team-building activities that foster connection and collaboration.",
      icon: Users,
    },
    {
      title: "Learning & Development",
      description: "Professional development programs to help employees enhance their skills and advance their careers.",
      icon: GraduationCap,
    },
    {
      title: "Paid Time Off",
      description: "Generous leave policies, vacation days, and public holiday benefits.",
      icon: CalendarDays,
    },
  ];

  return (
    <div className="py-8">
      
      {/* Intro Block */}
      <div className="pl-5 border-l-4 border-slate-200 dark:border-slate-700 max-w-5xl mb-12 text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>
          We believe that great work starts with a supportive environment. Our benefits are designed to promote well-being, career growth, and work-life balance, ensuring employees feel valued, empowered, and inspired to perform at their best every day.
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2f54eb] text-white">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-slate-900 dark:text-white mb-2">
                  {benefit.title}
                </h4>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
    </div>
  );
}
