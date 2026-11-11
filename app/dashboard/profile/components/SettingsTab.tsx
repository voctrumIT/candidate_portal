import { ChevronRight, HeadphonesIcon, HelpCircle, Shield } from "lucide-react";

export default function SettingsTab() {

    interface SettingItemProps {
        icon: React.ReactNode;
        iconBg: string;
        iconColor: string;
        title: string;
        subtitle?: string;
        action: React.ReactNode;
        borderBottom?: boolean;
    }
    function SettingItem({ icon, iconBg, iconColor, title, subtitle, action, borderBottom = true }: SettingItemProps) {
        return (
            <div className={`flex items-center justify-between p-5 ${borderBottom ? "border-b border-slate-100 dark:border-slate-800/50" : ""}`}>
                <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor} dark:bg-opacity-10 dark:brightness-125`}>
                        {icon}
                    </div>
                    <div>
                        <h4 className="text-[14px] font-bold text-slate-900 dark:text-white">{title}</h4>
                        {subtitle && <p className="mt-0.5 text-[12px] text-slate-400 dark:text-slate-500 dark:text-slate-400">{subtitle}</p>}
                    </div>
                </div>
                <div>{action}</div>
            </div>
        );
    }

    function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
        return (
            <div className="mb-8">
                <h3 className="mb-4 text-[13px] font-semibold text-slate-500 dark:text-slate-400">{title}</h3>
                <div className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] dark:border-slate-800 dark:bg-[#1a1a1a]">
                    {children}
                </div>
            </div>
        );
    }
    return (
        <div>
            <SettingsCard title="Support & Help">
                <SettingItem
                    icon={<HelpCircle className="h-5 w-5" />}
                    iconBg="bg-[#eff2fe]"
                    iconColor="text-[#2f54eb]"
                    title="Help center"
                    subtitle="Browse guides and FAQS"
                    action={<ChevronRight className="h-5 w-5 text-slate-300" />}
                />
                <SettingItem
                    icon={<HeadphonesIcon className="h-5 w-5" />}
                    iconBg="bg-[#fff9e6]"
                    iconColor="text-[#d4b106]"
                    title="Contact support"
                    subtitle="Reach out to our team"
                    action={<ChevronRight className="h-5 w-5 text-slate-300" />}
                />
                <SettingItem
                    icon={<Shield className="h-5 w-5" />}
                    iconBg="bg-[#faebf6]"
                    iconColor="text-[#c41d7f]"
                    title="Privacy policy"
                    subtitle="Read how we handle your data"
                    action={<ChevronRight className="h-5 w-5 text-slate-300" />}
                    borderBottom={false}
                />
            </SettingsCard>
        </div>
    )
}