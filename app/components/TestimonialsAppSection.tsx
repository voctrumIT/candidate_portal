'use client';

import { Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';

const testimonials = [
  {
    title: 'Found the right opportunity faster!',
    quote:
      'This platform made job searching simple. I found a role that truly matched my skills within weeks.',
    name: 'Shoaib Malik',
    role: 'Full Stack Eng. at Paytem',
    avatar: 'bg-amber-100',
  },
  {
    title: 'A smoother job search experience',
    quote:
      'Applying to jobs was quick and hassle-free. I could easily track my applications and stay organized.',
    name: 'Ayaan Khan',
    role: 'Product Manager, at Pile',
    avatar: 'bg-sky-100',
  },
  {
    title: 'Opportunities that actually fit',
    quote:
      'I discovered roles that aligned with my goals. It felt more focused and less overwhelming.',
    name: 'Neha Mehta',
    role: 'Sales Lead, at Onbeats',
    avatar: 'bg-emerald-100',
  },
  {
    title: 'Landed my dream job!',
    quote:
      'The AI matching feature is incredible. It suggested positions I never would have found on my own.',
    name: 'Rahul Sharma',
    role: 'Software Engineer at Google',
    avatar: 'bg-purple-100',
  },
  {
    title: 'Professional and efficient',
    quote:
      'From application to offer, the process was seamless. The platform really understands what candidates need.',
    name: 'Priya Patel',
    role: 'Data Analyst at Amazon',
    avatar: 'bg-rose-100',
  },
  {
    title: 'Best career decision',
    quote:
      'I was stuck in a dead-end job for years. This platform helped me transition to a field I love.',
    name: 'Vikram Singh',
    role: 'Product Designer at Microsoft',
    avatar: 'bg-cyan-100',
  },
  {
    title: 'Quick and responsive',
    quote:
      'The recruiters on this platform are amazing. I got responses within hours of applying.',
    name: 'Anita Desai',
    role: 'Marketing Lead at Meta',
    avatar: 'bg-orange-100',
  },
  {
    title: 'Transparency at its best',
    quote:
      'Finally a platform that shows you exactly what to expect. No hidden surprises in the job descriptions.',
    name: 'Karan Mehta',
    role: 'Senior Dev at Apple',
    avatar: 'bg-teal-100',
  },
  {
    title: 'Career growth accelerated',
    quote:
      'Within 3 months, I landed a senior role. The platform resources helped me prepare perfectly.',
    name: 'Sneha Gupta',
    role: 'Tech Lead at Netflix',
    avatar: 'bg-pink-100',
  },
];

export default function TestimonialsAppSection() {
  return (
    <section className="bg-white px-5 py-12 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1220px] overflow-hidden">
        <div className="text-center">
          <p className="section-kicker justify-center">Success Stories</p>
          <h2 className="mt-4 text-3xl font-black text-slate-800 md:text-4xl">
            Trusted By Job Seekers Like You
          </h2>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          spaceBetween={24}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            760: {
              slidesPerView: 2,
            },
            1080: {
              slidesPerView: 3,
            },
          }}
          className="mt-10 !pb-16"
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={item.name}>
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.05,
                }}
                whileHover={{
                  y: -5,
                }}
                className="h-full rounded-xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300"
              >
                <h3 className="max-w-xs text-xl font-semibold leading-7 text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-6 text-sm leading-6 text-slate-400">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="mt-auto flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`h-9 w-9 rounded-full ${item.avatar}`} />
                    <div>
                      <p className="text-xs font-black text-blue-700">{item.name}</p>
                      <p className="text-xs text-slate-400">{item.role}</p>
                    </div>
                  </div>
                  <p className="text-lg tracking-[0.12em] text-amber-400">★★★★★</p>
                </div>
              </motion.article>
            </SwiperSlide>
          ))}
        </Swiper>


        <div className="mt-20 grid items-center gap-10 rounded-lg bg-slate-50 px-7 py-10 md:grid-cols-[1.1fr_0.9fr] md:px-16">
          <div>
            <h2 className="max-w-xl text-3xl font-black leading-tight text-slate-950 md:text-4xl">
              Join thousands of users already using our{' '}
              <span className="text-blue-700">Voctrum app</span>
            </h2>
            <p className="mt-7 text-base text-slate-400">
              Access real-time job updates and apply seamlessly from your mobile device
            </p>

            <div className="mt-8 flex max-w-[520px] items-center rounded-full bg-[#eaf0ff] p-2 shadow-inner">
              <Phone className="ml-4 h-5 w-5 shrink-0 text-blue-700" />
              <input
                aria-label="Mobile number"
                placeholder="Enter your mobile number"
                className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-slate-500"
              />
              <button className="h-9 shrink-0 rounded-full bg-blue-700 px-5 text-xs font-bold text-white">
                Get App Link
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="inline-flex h-12 items-center rounded-md bg-slate-950 px-5 text-sm font-semibold text-white">
                GET IT ON&nbsp;<strong>Google Play</strong>
              </span>
              <span className="inline-flex h-12 items-center rounded-md bg-slate-950 px-5 text-sm font-semibold text-white">
                Download on the&nbsp;<strong>App Store</strong>
              </span>
              <span className="grid h-24 w-24 place-items-center border-2 border-dashed border-blue-400 bg-white text-xs font-bold text-slate-700">
                QR
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-5">
            <Image
              src="/homepage/m2.png"
              alt="Voctrum recommended jobs app screen"
              width={210}
              height={430}
              className="h-auto w-36 md:w-44"
            />
            <Image
              src="/homepage/m1.png"
              alt="Voctrum saved jobs app screen"
              width={210}
              height={430}
              className="h-auto w-36 md:w-44"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
