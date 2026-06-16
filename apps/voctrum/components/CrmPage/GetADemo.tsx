import { ArrowRight, BriefcaseBusiness, Mail, Phone, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const activityItems = [
  ["bg-[#dce8ff] text-[#4777ff]", Mail, "You emailed demo details to Tom H.", "10 min ago"],
  ["bg-[#efd9ff] text-[#b654ff]", BriefcaseBusiness, "Jane D. was assigned to you", "1 hr ago"],
  ["bg-[#ddfbe9] text-[#28c76f]", Phone, "Call with Jane D.", "1 hr ago"],
] as const

const appointmentItems = [
  ["bg-[#2f80ff]", Users, "Meeting with CF", "05:50 PM", "5 min ago"],
  ["bg-[#2f80ff]", Users, "Meeting with IN", "05:30 AM", "Proposal"],
  ["bg-[#ff781f]", Mail, "Acme Corp", "05:30 PM", "Email"],
  ["bg-[#16c65f]", Phone, "Robert L.", "15 min ago", "websites"],
] as const

const GetADemo = () => {
  return (
    <section className="relative -mb-px -mt-12 min-h-[768px] overflow-hidden bg-[#eef2f7] px-5 pt-14 md:px-8">
      <div className="relative z-10 mx-auto flex max-w-[1040px] flex-col items-center text-center">
        <h2 className="max-w-[520px] text-[38px] font-bold leading-[1.02] text-[#172283] sm:text-[46px]">
          Build Better
          <br />
          Client <span className="text-[#456cff]">Relationships</span>
        </h2>

        <p className="mt-4 max-w-[390px] text-sm leading-snug text-[#6c78bd]">
          Manage contacts, opportunities, appointments, and follow-ups smarter with Voctrum CRM.
        </p>

        <Link
          href="/contact"
          className="mt-6 inline-flex h-8 items-center gap-2 rounded-full bg-gradient-to-r from-[#25b8f4] to-[#082da9] pl-5 pr-1 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(20,75,196,0.22)] transition-transform hover:scale-[1.03]"
        >
          Get a Demo
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#0b2da9]">
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.6} />
          </span>
        </Link>

        <div className="relative mt-[58px] h-[305px] w-full max-w-[720px]">
          <RecentActivityCard />
          <AppointmentsCard />
          <OpportunityCard />
        </div>
      </div>
    </section>
  )
}

const RecentActivityCard = () => (
  <div className="absolute left-[26px] top-[72px] hidden w-[296px] -rotate-[5deg] rounded-[22px] bg-white px-5 py-6 text-left shadow-[0_28px_60px_rgba(65,78,120,0.16)] md:block">
    <div className="mb-4 flex items-center gap-3">
      <DragDots />
      <h3 className="text-sm font-bold text-[#343c54]">Recent Activity</h3>
    </div>

    <div className="space-y-4">
      {activityItems.map(([className, Icon, title, time]) => (
        <div key={title} className="flex gap-3">
          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${className}`}>
            <Icon className="h-3 w-3" strokeWidth={2.4} />
          </span>
          <div>
            <p className="text-[11px] font-semibold text-[#59627a]">{title}</p>
            <p className="mt-1 text-[11px] text-[#a4aec5]">{time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const AppointmentsCard = () => (
  <div className="absolute left-1/2 top-0 z-10 w-[318px] -translate-x-1/2 rounded-[22px] bg-white px-4 py-4 text-left shadow-[0_30px_70px_rgba(65,78,120,0.18)]">
    <div className="mb-2 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <DragDots />
        <h3 className="text-sm font-bold text-[#343c54]">Appointments</h3>
      </div>
      <span className="rounded-full bg-[#f8faff] px-3 py-1 text-[11px] font-medium text-[#a4aec5]">Today</span>
    </div>

    <div>
      {appointmentItems.map(([className, Icon, title, time, label]) => (
        <div key={title} className="flex items-center gap-3 border-t border-[#eef1f7] py-2.5 first:border-t-0">
          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white ${className}`}>
            <Icon className="h-3.5 w-3.5" strokeWidth={2.4} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-bold text-[#343c54]">{title}</p>
            <p className="text-[10px] text-[#a4aec5]">{label}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold text-[#687492]">{time}</p>
            <p className="text-[10px] text-[#a4aec5]">1x</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const OpportunityCard = () => (
  <div className="absolute right-[8px] top-[82px] z-20 hidden h-[150px] w-[290px] text-left sm:block">
    {/* Active Opportunities */}
    <div className="absolute left-0 top-0">
      <Image
        src="/CrmImage1.png"
        alt="Active opportunities summary"
        width={230}
        height={92}
        className="h-auto w-[230px] object-contain"
      />
    </div>

    {/* Enquiries */}
    <div className="absolute bottom-0 right-0">
      <Image
        src="/CrmImage2.png"
        alt="Enquiries summary"
        width={220}
        height={98}
        className="h-auto w-[220px] object-contain"
      />
    </div>
  </div>
)

const DragDots = () => (
  <span className="grid grid-cols-2 gap-0.5 text-[#9ba7c7]">
    <span className="h-1 w-1 rounded-full bg-current" />
    <span className="h-1 w-1 rounded-full bg-current" />
    <span className="h-1 w-1 rounded-full bg-current" />
    <span className="h-1 w-1 rounded-full bg-current" />
  </span>
)

export default GetADemo
