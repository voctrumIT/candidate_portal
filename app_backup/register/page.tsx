"use client";

import Image from "next/image";
import Link from "next/link";
import type { ChangeEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  Briefcase,
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  Eye,
  EyeOff,
  FileText,
  GraduationCap,
  Link as LinkIcon,
  Lock,
  LogIn,
  Mail,
  Plus,
  Search,
  Trash2,
  Upload,
  User,
  Users,
} from "lucide-react";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

type RegisterStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type UploadFile = { id: string; name: string; size: number; type: string; url?: string };

const initialSkillGroups = [
  { title: "Design", skills: ["UI Design", "Figma", "Prototyping", "Illustrator", "Motion"] },
  { title: "Development", skills: ["React", "Vue.js", "TypeScript", "Node.js", "Python"] },
  { title: "Soft Skills", skills: ["Communication", "Leadership", "Agile"] },
];

const degreeOptions = ["High School", "Associate", "B.Tech", "Master's", "MBA", "Phd", "Diploma", "B.Sc", "M.Tech", "BCA", "MCA"];

const employmentOptions = [
  { title: "Full-time", copy: "40 hrs/week . benefits", icon: Briefcase },
  { title: "Part-time", copy: "Flexible . up to 20 hrs", icon: Clock },
  { title: "Freelance / Contract", copy: "Project-based", icon: Users },
  { title: "Internship", copy: "Learning-focused", icon: GraduationCap },
];

export default function RegisterPage() {
  const [step, setStep] = useState<RegisterStep>(0);
  const [employment, setEmployment] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkills, setCustomSkills] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState("");
  const [customSkill, setCustomSkill] = useState("");
  const [showCustomSkill, setShowCustomSkill] = useState(false);
  const [selectedDegree, setSelectedDegree] = useState("");
  const [degreeSearch, setDegreeSearch] = useState("");
  const [workFiles, setWorkFiles] = useState<UploadFile[]>([]);
  const [resumeFiles, setResumeFiles] = useState<UploadFile[]>([]);
  const [portfolioLink, setPortfolioLink] = useState("");

  const next = () => setStep((current) => Math.min(current + 1, 6) as RegisterStep);
  const back = () => setStep((current) => Math.max(current - 1, 0) as RegisterStep);

  const toggleEmployment = (title: string) => {
    setEmployment((current) => (current.includes(title) ? current.filter((item) => item !== title) : [...current, title]));
  };

  const toggleSkill = (skill: string) => {
    setSkills((current) => (current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill]));
  };

  const addCustomSkill = () => {
    const value = customSkill.trim();
    if (!value) return;
    setCustomSkills((current) => (current.some((item) => item.toLowerCase() === value.toLowerCase()) ? current : [...current, value]));
    setSkills((current) => (current.some((item) => item.toLowerCase() === value.toLowerCase()) ? current : [...current, value]));
    setCustomSkill("");
    setShowCustomSkill(false);
  };

  const addFiles = (files: FileList | null, setter: (files: UploadFile[]) => void, current: UploadFile[]) => {
    if (!files) return;
    const nextFiles = Array.from(files).map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      size: file.size,
      type: file.type || "Uploaded file",
      url: URL.createObjectURL(file),
    }));
    setter([...current, ...nextFiles]);
  };

  const removeFile = (id: string, setter: (files: UploadFile[]) => void, current: UploadFile[]) => {
    const file = current.find((item) => item.id === id);
    if (file?.url) URL.revokeObjectURL(file.url);
    setter(current.filter((item) => item.id !== id));
  };

  return (
    <main className="min-h-screen bg-white text-[#101828]">
      <AuthHeader />
      {step === 0 ? (
        <GetStarted onRegister={next} />
      ) : (
        <section className="relative min-h-[calc(100vh-70px)] overflow-hidden bg-[#fbfbfc] px-5 py-16">
          <RegisterBackground />
          <div className="relative mx-auto w-full max-w-[930px] rounded-lg bg-[#f7f7f8]/95 px-10 py-11 shadow-sm md:px-16">
            {step === 1 && <EmploymentPreference selected={employment} onToggle={toggleEmployment} onBack={back} onNext={next} />}
            {step === 2 && (
              <SkillsStep
                selected={skills}
                customSkills={customSkills}
                search={skillSearch}
                customSkill={customSkill}
                showCustomSkill={showCustomSkill}
                onSearch={setSkillSearch}
                onToggle={toggleSkill}
                onCustomSkill={setCustomSkill}
                onShowCustomSkill={() => setShowCustomSkill(true)}
                onAddCustomSkill={addCustomSkill}
                onBack={back}
                onNext={next}
              />
            )}
            {step === 3 && <EducationStep selectedDegree={selectedDegree} search={degreeSearch} onSearch={setDegreeSearch} onSelectDegree={setSelectedDegree} onBack={back} onNext={next} />}
            {step === 4 && <WorkHistoryStep files={workFiles} onAddFiles={(files) => addFiles(files, setWorkFiles, workFiles)} onRemoveFile={(id) => removeFile(id, setWorkFiles, workFiles)} onBack={back} onNext={next} />}
            {step === 5 && (
              <ResumeStep
                files={resumeFiles}
                portfolioLink={portfolioLink}
                onPortfolioLink={setPortfolioLink}
                onAddFiles={(files) => addFiles(files, setResumeFiles, resumeFiles)}
                onRemoveFile={(id) => removeFile(id, setResumeFiles, resumeFiles)}
                onBack={back}
                onNext={next}
              />
            )}
            {step === 6 && <DoneStep selectedSkills={skills.length} employment={employment[0] || "Not selected"} resumeAdded={resumeFiles.length > 0} onBack={back} />}
          </div>
        </section>
      )}
    </main>
  );
}

function AuthHeader() {
  return (
    <header className="flex h-[70px] items-center justify-between border-b border-[#eef0f4] bg-white px-8 shadow-[0_2px_10px_rgba(16,24,40,0.08)] sm:px-14">
      <Link href="/" aria-label="Voctrum home" className="flex items-center">
        <Image src="/common/logo.png" alt="Voctrum" width={118} height={38} className="h-auto w-[118px] object-contain" priority />
      </Link>
      <div className="flex items-center gap-3 text-sm text-[#667085] sm:text-base">
        <span className="hidden sm:inline">Already have an&nbsp; account ?</span>
        <Link href="/login" className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#2f54eb] px-5 text-xs font-semibold !text-white shadow-sm transition hover:bg-[#2447d8] hover:!text-white">
          <LogIn className="h-4 w-4 text-white" />
          Login
        </Link>
      </div>
    </header>
  );
}

function RegisterBackground() {
  return <div className="pointer-events-none absolute inset-0 opacity-80 [background-image:linear-gradient(46deg,transparent_0%,transparent_52%,rgba(47,84,235,0.035)_52.4%,transparent_64%),linear-gradient(132deg,transparent_0%,transparent_58%,rgba(47,84,235,0.03)_58.4%,transparent_70%)]" />;
}

function GetStarted({ onRegister }: { onRegister: () => void }) {
  return (
    <section className="grid min-h-[calc(100vh-70px)] grid-cols-1 lg:grid-cols-2">
      <aside className="flex items-center justify-center bg-[#f8f8f9] px-8 py-12 lg:px-14">
        <div className="w-full max-w-[520px]">
          <h1 className="text-center text-3xl font-extrabold text-[#101828]">
            V<span className="text-[#2f54eb]">octrum</span>
          </h1>
          <p className="mt-4 text-center text-sm text-[#98a2b3]">Create your account to explore opportunities that match your ambitions</p>
          <div className="mx-auto mt-12 max-w-[420px]">
            <h2 className="text-lg font-extrabold uppercase text-[#101828]">How It Works</h2>
            <div className="mt-8 space-y-10">
              <HowItWorksItem number="1" title="Create your profile" copy="Add your skills and experience to get matched opportunities" />
              <HowItWorksItem number="2" title="Discover matching roles" copy="Browse curated jobs and find roles that match your experience" />
              <HowItWorksItem number="3" title="Get Hired" copy="Apply, track progress and land your next role" />
            </div>
          </div>
          <p className="mt-24 text-center text-sm font-medium italic text-[#2f54eb]">&quot; Takes less than 2 minutes to get started &quot;</p>
        </div>
      </aside>

      <section className="flex items-center justify-center px-8 py-12 lg:px-14">
        <form className="w-full max-w-[520px]" onSubmit={(event) => event.preventDefault()}>
          <div className="mb-9 text-center">
            <h2 className="text-4xl font-extrabold text-[#101828]">Get Started</h2>
            <p className="mt-4 text-sm text-[#98a2b3]">Register to start exploring jobs and build your future</p>
          </div>
          <LineInput icon={<User className="h-5 w-5" />} placeholder="Name" />
          <LineInput icon={<Mail className="h-5 w-5" />} placeholder="Email" type="email" />
          <LineInput icon={<Lock className="h-5 w-5" />} placeholder="Password" type="password" trailing={<EyeOff className="h-5 w-5" />} />
          <label className="mt-6 flex items-center gap-3 text-sm text-[#475467]">
            <input type="checkbox" className="h-4 w-4 rounded border-[#d0d5dd]" />
            I agree to the Terms &amp; Privacy Policy
          </label>
          <button type="button" onClick={onRegister} className="mt-7 h-14 w-full rounded-lg bg-[#2f54eb] text-lg font-bold text-white transition hover:bg-[#2447d8]">
            Register
          </button>
          <div className="my-8 flex items-center gap-3 text-sm text-[#667085]">
            <span className="h-px flex-1 bg-[#e4e7ec]" />
            Or create with
            <span className="h-px flex-1 bg-[#e4e7ec]" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SocialCreate label="Create with Google" icon={<FcGoogle className="h-7 w-7" />} />
            <SocialCreate label="Create with Facebook" icon={<FaFacebookF className="h-6 w-6 text-[#2f54eb]" />} />
          </div>
        </form>
      </section>
    </section>
  );
}

function HowItWorksItem({ number, title, copy }: { number: string; title: string; copy: string }) {
  return (
    <div className="relative flex gap-6">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#2f54eb] text-sm font-bold text-white">{number}</span>
      <span>
        <span className="block text-base font-bold text-[#667085]">{title}</span>
        <span className="mt-2 block max-w-[360px] text-sm leading-6 text-[#98a2b3]">{copy}</span>
      </span>
    </div>
  );
}

type StepProps = { onBack: () => void; onNext: () => void };

function EmploymentPreference({ selected, onToggle, onBack, onNext }: StepProps & { selected: string[]; onToggle: (value: string) => void }) {
  return (
    <>
      <StepHeading title="Employment Prefrence" copy="What type of work fits your lifestyle best?" step={1} percent={0} filled={0} />
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {employmentOptions.map((option) => {
          const Icon = option.icon;
          const checked = selected.includes(option.title);
          return (
            <label key={option.title} className="flex h-[78px] cursor-pointer items-center justify-between rounded-lg border border-[#dfe3ea] bg-white px-5 text-left shadow-sm transition hover:border-[#2f54eb]">
              <span className="flex items-center gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#e9edff] text-[#2f54eb]">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-base font-semibold text-[#101828]">{option.title}</span>
                  <span className="mt-1 block text-sm text-[#98a2b3]">{option.copy}</span>
                </span>
              </span>
              <input type="checkbox" checked={checked} onChange={() => onToggle(option.title)} className="h-5 w-5 rounded border-[#98a2b3] accent-[#2f54eb]" />
            </label>
          );
        })}
      </div>
      <StepActions onBack={onBack} onNext={onNext} />
    </>
  );
}

function SkillsStep({
  selected,
  customSkills,
  search,
  customSkill,
  showCustomSkill,
  onSearch,
  onToggle,
  onCustomSkill,
  onShowCustomSkill,
  onAddCustomSkill,
  onBack,
  onNext,
}: StepProps & {
  selected: string[];
  customSkills: string[];
  search: string;
  customSkill: string;
  showCustomSkill: boolean;
  onSearch: (value: string) => void;
  onToggle: (value: string) => void;
  onCustomSkill: (value: string) => void;
  onShowCustomSkill: () => void;
  onAddCustomSkill: () => void;
}) {
  const groups = useMemo(() => {
    const query = search.trim().toLowerCase();
    const withCustom = customSkills.length ? [...initialSkillGroups, { title: "Custom Skills", skills: customSkills }] : initialSkillGroups;
    if (!query) return withCustom;
    return withCustom
      .map((group) => ({ ...group, skills: group.skills.filter((skill) => skill.toLowerCase().includes(query)) }))
      .filter((group) => group.skills.length > 0);
  }, [customSkills, search]);

  return (
    <>
      <StepHeading title="Your Skills" copy="Select that all represents you" step={2} percent={20} filled={1} />
      <SearchBox placeholder="Search Skill" value={search} onChange={onSearch} />
      <div className="mt-7 space-y-6">
        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-4 text-lg font-semibold text-[#475467]">{group.title}</h3>
            <div className="flex flex-wrap gap-4">
              {group.skills.map((skill) => <Pill key={skill} label={skill} selected={selected.includes(skill)} onClick={() => onToggle(skill)} />)}
            </div>
          </div>
        ))}
        {groups.length === 0 ? <p className="text-sm text-[#98a2b3]">No skills found. Add it as a custom skill.</p> : null}
      </div>
      {showCustomSkill ? (
        <div className="mt-6 flex max-w-[560px] gap-3">
          <input value={customSkill} onChange={(event) => onCustomSkill(event.target.value)} onKeyDown={(event) => event.key === "Enter" && onAddCustomSkill()} placeholder="Enter custom skill" className="h-11 min-w-0 flex-1 rounded-lg border border-[#d0d5dd] bg-white px-4 text-sm outline-none placeholder:text-[#98a2b3]" />
          <button type="button" onClick={onAddCustomSkill} className="h-11 rounded-lg bg-[#2f54eb] px-5 text-sm font-bold text-white transition hover:bg-[#2447d8]">Add</button>
        </div>
      ) : (
        <button type="button" onClick={onShowCustomSkill} className="mt-6 inline-flex items-center gap-2 text-base font-medium text-[#475467]">
          <Plus className="h-5 w-5 text-[#2f54eb]" />
          Add Custom Skills
        </button>
      )}
      <StepActions onBack={onBack} onNext={onNext} />
    </>
  );
}

function EducationStep({ selectedDegree, search, onSearch, onSelectDegree, onBack, onNext }: StepProps & { selectedDegree: string; search: string; onSearch: (value: string) => void; onSelectDegree: (value: string) => void }) {
  const filteredDegrees = degreeOptions.filter((degree) => degree.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <>
      <StepHeading title="Add Education" copy="Add your acadmic background" step={3} percent={40} filled={2} />
      <SearchBox placeholder="Search Degree" value={search} onChange={onSearch} />
      <div className="mt-6">
        <h3 className="mb-4 text-lg font-semibold text-[#475467]">Degree</h3>
        <div className="flex flex-wrap gap-4">
          {filteredDegrees.map((degree) => <Pill key={degree} label={degree} selected={selectedDegree === degree} onClick={() => onSelectDegree(selectedDegree === degree ? "" : degree)} />)}
        </div>
        {filteredDegrees.length === 0 ? <p className="text-sm text-[#98a2b3]">No degree found.</p> : null}
      </div>
      <div className="mt-6 space-y-5">
        <Field label="Field of Study *" placeholder="e.g Computer Science" />
        <Field label="Institution *" placeholder="University / College Name" />
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Start Year *" placeholder="Enter Year" type="date" icon={<CalendarDays className="h-5 w-5 text-[#2f54eb]" />} />
          <Field label="End Year *" placeholder="Enter Year" type="date" icon={<CalendarDays className="h-5 w-5 text-[#2f54eb]" />} />
        </div>
      </div>
      <label className="mt-6 flex items-center gap-3 text-base text-[#667085]">
        <input type="checkbox" className="h-4 w-4 rounded border-[#d0d5dd] accent-[#2f54eb]" />
        Currently Pursuing
      </label>
      <StepActions onBack={onBack} onNext={onNext} compact />
    </>
  );
}

function WorkHistoryStep({ files, onAddFiles, onRemoveFile, onBack, onNext }: StepProps & { files: UploadFile[]; onAddFiles: (files: FileList | null) => void; onRemoveFile: (id: string) => void }) {
  return (
    <>
      <StepHeading title="Work History" copy="Add your experience" step={4} percent={60} filled={3} />
      <div className="mx-auto mt-8 max-w-[430px] rounded-lg bg-white px-5 py-7 text-center">
        <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-[#e9edff] text-[#2f54eb]">
          <FileText className="h-5 w-5" />
        </span>
        <h3 className="mt-4 text-base font-bold text-[#101828]">{files.length ? "Experience files added" : "No experience added yet"}</h3>
        <p className="mx-auto mt-2 max-w-[270px] text-sm leading-5 text-[#98a2b3]">Add your work roles to help us match you with the right jobs</p>
        <FilePicker id="work-history-file" label="Upload Experience" icon={<Plus className="h-4 w-4" />} onChange={onAddFiles} />
        <FileList files={files} onRemove={onRemoveFile} />
      </div>
      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <SelectField label="Seniority Level *" placeholder="Select Option" />
        <Field label="Experience *" placeholder="Your Experience" />
      </div>
      <StepActions onBack={onBack} onNext={onNext} />
    </>
  );
}

function ResumeStep({ files, portfolioLink, onPortfolioLink, onAddFiles, onRemoveFile, onBack, onNext }: StepProps & { files: UploadFile[]; portfolioLink: string; onPortfolioLink: (value: string) => void; onAddFiles: (files: FileList | null) => void; onRemoveFile: (id: string) => void }) {
  return (
    <>
      <StepHeading title="Resume & Portfolio" copy="Lets recruiters discover your work" step={5} percent={80} filled={4} />
      <div className="mx-auto mt-8 w-full max-w-[470px] rounded-xl bg-white px-5 py-8 text-center shadow-[0_6px_18px_rgba(16,24,40,0.16)]">
        <span className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-[#e9edff] text-[#2f54eb]">
          <Upload className="h-5 w-5" />
        </span>
        <h3 className="mt-5 text-base font-bold text-[#101828]">Click to Upload or drag and drop</h3>
        <p className="mt-2 text-sm leading-5 text-[#98a2b3]">Images (PDF, DOC, DOCX) only,<br />Maximum file size 10 MB</p>
        <FilePicker id="resume-file" label="Browse Files" onChange={onAddFiles} />
        <FileList files={files} onRemove={onRemoveFile} />
      </div>
      <div className="mt-8">
        <Field label="Portfolio / LinkedIn *" placeholder="Enter Link" value={portfolioLink} onChange={onPortfolioLink} icon={<LinkIcon className="h-5 w-5 text-[#2f54eb]" />} />
      </div>
      <StepActions onBack={onBack} onNext={onNext} />
    </>
  );
}

function DoneStep({ selectedSkills, employment, resumeAdded, onBack }: { selectedSkills: number; employment: string; resumeAdded: boolean; onBack: () => void }) {
  return (
    <>
      <StepHeading title="All Done" copy="Lets recruiters discover your work" percent={100} filled={5} completeOnly />
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="rounded-xl bg-white px-8 py-9 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-dashed border-[#101828] bg-white">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#16a34a] text-white">
              <Check className="h-7 w-7 stroke-[3]" />
            </span>
          </span>
          <h3 className="mt-5 text-lg font-medium text-[#2f54eb]">Profile Status</h3>
          <p className="mt-2 text-lg font-extrabold text-[#101828]">Fully Completed</p>
          <p className="mx-auto mt-3 max-w-[300px] text-sm leading-5 text-[#98a2b3]">Your profile is complete--you&apos;re ready to discover the right opportunities</p>
        </div>
        <div className="flex items-center gap-7 rounded-xl bg-white px-8 py-9">
          <div className="grid h-28 w-28 shrink-0 place-items-center rounded-full border-[16px] border-[#16a34a] text-center">
            <span className="text-xs text-[#667085]"><strong className="block text-[#101828]">100%</strong>Profile Score</span>
          </div>
          <span>
            <h3 className="text-lg font-extrabold text-[#101828]">Profile Strength</h3>
            <p className="mt-2 max-w-[250px] text-sm leading-5 text-[#667085]">A complete profile increases your chances of getting noticed by recruiters</p>
          </span>
        </div>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-4">
        <SummaryCard value={`${selectedSkills}`} label="Skills added" />
        <SummaryCard value="3 Years" label="Experience" />
        <SummaryCard value={resumeAdded ? "Yes" : "No"} label="Resume Added" />
        <SummaryCard value={employment} label="Preferred Job Type" />
      </div>
      <div className="mt-12 flex justify-end gap-5">
        <button type="button" onClick={onBack} className="h-11 w-32 rounded-lg border border-[#2f54eb] bg-white text-sm font-bold text-[#2f54eb] transition hover:bg-[#eef3ff]">Back</button>
        <Link href="/dashboard" className="inline-flex h-11 w-36 items-center justify-center rounded-lg bg-[#2f54eb] text-sm font-bold !text-white transition hover:bg-[#2447d8] hover:!text-white">Explore Jobs</Link>
      </div>
    </>
  );
}

function StepHeading({ title, copy, step, percent, filled, completeOnly }: { title: string; copy: string; step?: number; percent: number; filled: number; completeOnly?: boolean }) {
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#101828]">{title}</h1>
      <p className="mt-3 text-sm text-[#98a2b3]">{copy}</p>
      <div className="mt-8 flex items-center justify-between gap-8">
        <div className="flex flex-1 gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index} className={`h-2 w-20 rounded-full ${index < filled || completeOnly ? "bg-[#2f54eb]" : "bg-[#d9d9d9]"}`} />
          ))}
        </div>
        <span className="min-w-[210px] text-right text-sm font-bold text-[#101828]">
          {step ? <span className="font-medium text-[#2f54eb]">Step {step} of 5</span> : null}
          {step ? " - " : null}
          {percent}% complete
        </span>
      </div>
    </div>
  );
}

function StepActions({ onBack, onNext, compact }: StepProps & { compact?: boolean }) {
  return (
    <div className={`flex justify-end gap-5 ${compact ? "mt-7" : "mt-24"}`}>
      <button type="button" onClick={onBack} className="h-11 w-32 rounded-lg border border-[#2f54eb] bg-white text-sm font-bold text-[#2f54eb] transition hover:bg-[#eef3ff]">Back</button>
      <button type="button" onClick={onNext} className="h-11 w-36 rounded-lg bg-[#2f54eb] text-sm font-bold text-white transition hover:bg-[#2447d8]">Continue</button>
    </div>
  );
}

function LineInput({ icon, placeholder, type = "text", trailing }: { icon: ReactNode; placeholder: string; type?: string; trailing?: ReactNode }) {
  return (
    <label className="mt-8 flex h-11 items-center gap-3 border-b border-[#dfe3ea] text-[#2f54eb]">
      {icon}
      <input type={type} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent text-sm text-[#101828] outline-none placeholder:text-[#98a2b3]" />
      {trailing}
    </label>
  );
}

function SocialCreate({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <button type="button" className="inline-flex h-14 items-center justify-center gap-3 rounded-lg border border-[#dfe3ea] bg-white px-4 text-sm text-[#667085] transition hover:border-[#cbd5e1]">
      {icon}
      {label}
    </button>
  );
}

function SearchBox({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="mt-7 flex h-12 max-w-[560px] items-center gap-3 rounded-lg border border-[#d0d5dd] bg-white px-4 text-[#2f54eb]">
      <Search className="h-5 w-5" />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#667085]" />
    </label>
  );
}

function Pill({ label, selected, onClick }: { label: string; selected?: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`h-9 rounded-full border px-6 text-sm transition ${selected ? "border-[#2f54eb] bg-[#2f54eb] text-white" : "border-[#2f54eb] bg-white text-[#2f54eb] hover:bg-[#eef3ff]"}`}>
      {label}
    </button>
  );
}

function Field({ label, placeholder, icon, type = "text", value, onChange }: { label: string; placeholder: string; icon?: ReactNode; type?: string; value?: string; onChange?: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-3 block text-lg font-medium text-[#475467]">{label}</span>
      <span className="flex h-12 items-center gap-3 rounded-lg border border-[#cfd4dc] bg-white px-4">
        {icon}
        <input type={type} value={value} onChange={(event) => onChange?.(event.target.value)} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#98a2b3]" />
      </span>
    </label>
  );
}

function SelectField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-3 block text-lg font-medium text-[#475467]">{label}</span>
      <span className="flex h-12 items-center rounded-lg border border-[#cfd4dc] bg-white px-4">
        <select className="min-w-0 flex-1 bg-transparent text-sm text-[#98a2b3] outline-none">
          <option>{placeholder}</option>
          <option>Entry Level</option>
          <option>Mid Level</option>
          <option>Senior Level</option>
        </select>
        <ChevronDown className="pointer-events-none h-4 w-4 text-[#98a2b3]" />
      </span>
    </label>
  );
}

function FilePicker({ id, label, icon, onChange }: { id: string; label: string; icon?: ReactNode; onChange: (files: FileList | null) => void }) {
  return (
    <label htmlFor={id} className="mx-auto mt-4 inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#2f54eb] px-5 text-sm font-bold text-white transition hover:bg-[#2447d8]">
      {icon}
      {label}
      <input id={id} type="file" multiple className="sr-only" onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.files)} />
    </label>
  );
}

function FileList({ files, onRemove }: { files: UploadFile[]; onRemove: (id: string) => void }) {
  if (!files.length) return null;
  return (
    <div className="mt-5 space-y-4">
      {files.map((file) => <UploadRow key={file.id} file={file} onRemove={() => onRemove(file.id)} />)}
    </div>
  );
}

function UploadRow({ file, onRemove }: { file: UploadFile; onRemove: () => void }) {
  return (
    <div className="group relative rounded-lg bg-[#f4f4f5] px-4 py-3 text-left">
      <div className="flex items-center gap-3">
        <FileText className="h-7 w-7 shrink-0 text-[#b38a00]" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-sm font-semibold text-[#101828]">{file.name}</p>
            <button type="button" onClick={onRemove} aria-label={`Remove ${file.name}`} className="text-red-500 transition hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs">
            <span className="text-[#98a2b3]">{formatFileSize(file.size)}</span>
            <span className="text-[#16a34a]">Completed</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-[#c5cffb]">
            <div className="h-1.5 rounded-full bg-[#2f54eb]" style={{ width: "100%" }} />
          </div>
        </div>
        <Eye className="h-4 w-4 text-[#2f54eb]" />
      </div>
      <div className="pointer-events-none absolute left-4 top-full z-10 mt-2 hidden w-[260px] rounded-lg border border-[#dfe3ea] bg-white p-3 text-xs text-[#667085] shadow-lg group-hover:block">
        <p className="font-bold text-[#101828]">Preview file</p>
        <p className="mt-1 break-all">{file.name}</p>
        <p className="mt-1">{file.type || "Uploaded file"} - {formatFileSize(file.size)}</p>
        {file.url ? <p className="mt-2 text-[#2f54eb]">Hover preview ready. Open from the uploaded file in browser controls if supported.</p> : null}
      </div>
    </div>
  );
}

function SummaryCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border-l-4 border-[#2f54eb] bg-[#e9edff] px-4 py-4">
      <p className="text-sm font-extrabold text-[#101828]">{value}</p>
      <p className="mt-2 text-sm text-[#667085]">{label}</p>
    </div>
  );
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
