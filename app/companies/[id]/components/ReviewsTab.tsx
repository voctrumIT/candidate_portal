import { Star } from "lucide-react";
import Image from "next/image";

export default function ReviewsTab() {
  const ratings = [
    { label: "FIVE", value: 95 },
    { label: "FOUR", value: 80 },
    { label: "THREE", value: 60 },
    { label: "TWO", value: 30 },
    { label: "ONE", value: 15 },
  ];

  const reviews = [
    {
      id: 1,
      name: "Burhan Siddiq",
      role: "Frontend Developer",
      text: "The organization promotes a healthy and productive workplace through strong leadership and teamwork. Flexible work options, mentorship, and continuous learning opportunities have played",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
    {
      id: 2,
      name: "Monisa Mir",
      role: "UI/UX Designer",
      text: "The workplace fosters creativity and collaboration, making it easy to share ideas and learn from experienced colleagues. The supportive culture and growth opportunities have played a key role",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    {
      id: 3,
      name: "Telsco perri",
      role: "ML Engineer",
      text: "Wipro provides excellent learning opportunities and exposure to global projects. The work environment is collaborative, and there are plenty of opportunities for career growth and skill development",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
  ];

  return (
    <div className="py-8 grid gap-12 lg:grid-cols-[1fr_400px]">
      
      {/* Left Column: Reviews List */}
      <div>
        {/* Rating Bars */}
        <div className="mb-12 space-y-3">
          {ratings.map((rating) => (
            <div key={rating.label} className="flex items-center gap-4 text-[12px] font-bold text-slate-500">
              <span className="w-10">{rating.label}</span>
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
              <div className="h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-amber-400 rounded-full" 
                  style={{ width: `${rating.value}%` }} 
                />
              </div>
              <span className="w-8 text-right">98K</span>
            </div>
          ))}
        </div>

        {/* Individual Reviews */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-[16px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-100">
                    <Image src={review.avatar} alt={review.name} width={40} height={40} className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#2f54eb]">{review.name}</h4>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400">{review.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
                "{review.text}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Add a Review */}
      <div>
        {/* Overall Rating Box */}
        <div className="rounded-[16px] bg-[#fffbf2] dark:bg-amber-900/10 p-8 text-center mb-10 flex flex-col items-center justify-center border border-amber-100 dark:border-amber-900/30">
          <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">Overall Rating</p>
          <h2 className="text-5xl font-extrabold text-slate-800 dark:text-white mb-4">4.5</h2>
          <div className="flex items-center gap-1.5 text-amber-400 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-amber-400" />
            ))}
          </div>
          <p className="text-[13px] text-slate-500">Based on 348 verified reviews</p>
        </div>

        {/* Add a Review Form */}
        <div>
          <h3 className="text-[18px] font-bold text-slate-900 dark:text-white mb-6">Add a Review</h3>
          
          <div className="mb-6">
            <div className="flex items-center gap-1 text-amber-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4" /> // Outline stars
              ))}
            </div>
            <p className="text-[12px] text-slate-500">Add Your Rating</p>
          </div>

          <div className="space-y-5 text-[13px]">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">Name</label>
              <input 
                type="text" 
                placeholder="Enter your name" 
                className="w-full h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] px-4 outline-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb] transition"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">Designation</label>
              <input 
                type="text" 
                placeholder="eg Backend developer" 
                className="w-full h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] px-4 outline-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb] transition"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">Write Your Review</label>
              <textarea 
                placeholder="Write Here" 
                className="w-full h-32 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] p-4 outline-none focus:border-[#2f54eb] focus:ring-1 focus:ring-[#2f54eb] transition resize-none"
              />
            </div>
            <button className="w-full h-11 rounded-lg bg-[#2f54eb] font-bold !text-white transition hover:bg-[#2447d8]">
              Submit
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
