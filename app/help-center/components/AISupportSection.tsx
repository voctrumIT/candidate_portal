"use client";

import { Zap, BrainCircuit, Clock, ShieldCheck, MessageSquare, BotMessageSquare } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Ask Your Question ?",
    desc: "Type any question related to jobs, applications, hiring, account settings",
    icon: MessageSquare,
  },
  {
    num: "02",
    title: "Receive Instant Answers",
    desc: "Get accurate responses in seconds without waiting for support tickets or emails",
    icon: Clock,
  },
  {
    num: "03",
    title: "Get Personalized Guidance",
    desc: "Receive tailored recommendations based on your goals, whether you're hiring",
    icon: BrainCircuit,
  },
  {
    num: "04",
    title: "Take Action with Confidence",
    desc: "Follow suggested steps, resources, and solutions to quickly resolve issues and move",
    icon: ShieldCheck,
  },
];

export default function AISupportSection() {
  return (
    <section className="bg-[#f8f8f9] dark:bg-slate-900/50 py-20 overflow-hidden">
      <div className="mx-auto max-w-[1300px] px-5 md:px-10 lg:px-16">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          
          {/* Left Column: Timeline */}
          <div className="flex-1 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
              Get Instant Support with <span className="text-slate-900 dark:text-white">AI</span>
            </h2>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mb-10">
              Get instant answers, guidance, and support from our AI Assistant anytime, anywhere
            </p>

            <p className="text-sm font-bold text-blue-600 mb-6">How AI Support Works ?</p>

            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.125rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
              
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="relative flex items-start gap-6">
                    <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-slate-800 dark:text-slate-300 ring-4 ring-[#f8f8f9] dark:ring-slate-900/50 text-xs font-bold">
                      {step.num}
                    </div>
                    
                    <div className="flex-1 flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e9edff] dark:bg-slate-800 text-blue-600">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-[15px] font-bold text-slate-900 dark:text-white mb-1">{step.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>

            <div className="mt-12 flex gap-4">
              <button className="h-11 rounded-lg bg-blue-600 px-7 text-sm font-bold text-white transition hover:bg-blue-700">
                Ask AI Assistant
              </button>
              <button className="h-11 rounded-lg border border-blue-600 bg-transparent px-7 text-sm font-bold text-blue-600 transition hover:bg-blue-50 dark:hover:bg-slate-800">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Column: Chat UI */}
          <div className="flex-1 w-full max-w-lg">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] p-8 shadow-sm">
              
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 dark:border-slate-700 bg-blue-50 dark:bg-slate-800 px-3 py-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 mb-5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                Uob Support
              </div>
              
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">
                Need help <span className="text-blue-500">fast?</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Get instant answers and support from our AI Assistant anytime, anywhere.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                  <Zap className="h-3 w-3" /> Instant Responses
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                  <BrainCircuit className="h-3 w-3" /> Smart Guidance
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                  <BotMessageSquare className="h-3 w-3" /> Uob Support
                </span>
              </div>

              {/* Chat area */}
              <div className="space-y-4">
                
                {/* User Bubble */}
                <div className="flex justify-end">
                  <div className="rounded-2xl rounded-tr-sm bg-blue-600 px-4 py-2.5 text-[13px] text-white max-w-[85%]">
                    How can I track my applications?
                  </div>
                </div>

                {/* AI Bubble */}
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-sm border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-[13px] text-slate-700 dark:text-slate-300 max-w-[85%]">
                    Go to Dachboard -&gt; My Applications to see real-time status updates for every job yoi&apos;ve applied to.
                  </div>
                </div>

                {/* User Bubble */}
                <div className="flex justify-end">
                  <div className="rounded-2xl rounded-tr-sm bg-blue-600 px-4 py-2.5 text-[13px] text-white max-w-[85%]">
                    How do I upload my resume?
                  </div>
                </div>

                {/* AI Typing */}
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 max-w-[85%]">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>

              </div>
              
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
