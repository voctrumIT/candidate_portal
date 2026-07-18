interface CompanyTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function CompanyTabs({ activeTab, onTabChange }: CompanyTabsProps) {
  const tabs = ["Overview", "Jobs", "Reviews", "Benefits"];

  return (
    <div className="mt-12 border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto flex max-w-[1360px] gap-10 px-5 md:px-10 lg:px-16 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`pb-4 text-[15px] font-bold transition whitespace-nowrap ${
                isActive
                  ? "border-b-2 border-[#2f54eb] text-[#2f54eb]"
                  : "border-b-2 border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}
