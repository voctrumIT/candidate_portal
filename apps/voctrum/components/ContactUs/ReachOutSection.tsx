import Image from "next/image"

const cards = [
  {
    icon: "/ContactUsIcon9.svg",
    title: "Fast Response",
    desc: "We aim to respond to inquiries promptly",
  },
  {
    icon: "/ContactUsIcon10.svg",
    title: "Support",
    desc: "Connect with the right team and receive guidance tailored",
  },
  {
    icon: "/ContactUsIcon11.svg",
    title: "Reliable",
    desc: "Every inquiry is handled with professionalism.",
  },
]

export default function ReachOutSection() {
  return (
    <section className="bg-[#edf1f7] px-5 py-16 sm:px-10">
      <div className="mx-auto max-w-[1100px]">
        <h2 className="text-[36px] font-extrabold text-[#172283] sm:text-[42px]">
          Why <span className="text-[#456cff]">Reach</span> Out to Us ?
        </h2>
        <p className="mt-2 max-w-[500px] text-[13px] text-[#6d7fc4]">
          Whether you're exploring opportunities, partnerships, or have a question, we're here to help
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {cards.map(({ icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 rounded-[20px] bg-white px-6 py-6 shadow-[0_8px_30px_rgba(8,38,118,0.07)]">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[14px] bg-[#172283]">
                <Image src={icon} alt={title} width={60} height={60} />
              </span>
              <div>
                <p className="text-[14px] font-bold text-[#172283]">{title}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-[#6d7fc4]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
