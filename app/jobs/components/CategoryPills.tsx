import { PenTool, Code, LineChart, PieChart, Settings, Cpu } from 'lucide-react';

export default function CategoryPills() {
  const categories = [
    { name: 'UI/UX Designer', icon: PenTool },
    { name: 'Full Stack', icon: Code },
    { name: 'Digital Marketing', icon: LineChart },
    { name: 'Data Science', icon: PieChart },
    { name: 'Engineering', icon: Settings },
    { name: 'AI/ML', icon: Cpu },
  ];

  return (
    <div className="mx-auto mt-8 flex max-w-[1360px] flex-wrap items-center gap-4 px-5 md:px-10 lg:px-16">
      {/* Active Pill (All) */}
      <button className="flex h-10 items-center justify-center rounded-full bg-blue-700 px-8 text-[13px] font-semibold text-white shadow-sm transition hover:bg-blue-800">
        All
      </button>

      {/* Inactive Pills */}
      {categories.map(({ name, icon: Icon }) => (
        <button
          key={name}
          className="flex h-10 items-center justify-center gap-2 rounded-full border border-blue-500 bg-white dark:bg-[#1a1a1a] px-5 text-[13px] font-medium text-blue-600 transition hover:bg-blue-50"
        >
          <Icon className="h-4 w-4" />
          {name}
        </button>
      ))}
    </div>
  );
}
