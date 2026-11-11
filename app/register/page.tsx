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
  MapPin,
  Plus,
  Search,
  Trash2,
  Upload,
  User,
  Users,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { authService } from "../../services/auth";
import { profileService, validateProfileUpdate } from "../../services/profile";
import { useRouter } from "next/navigation";
import { toast } from "../components/Toast";

type RegisterStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type UploadFile = { id: string; name: string; size: number; type: string; url?: string };

const initialSkillGroups = [
  { title: "Design", skills: ["UI Design", "Figma", "Prototyping", "Illustrator", "Motion"] },
  { title: "Development", skills: ["React", "Vue.js", "TypeScript", "Node.js", "Python", "SQL"] },
  { title: "Soft Skills", skills: ["Communication", "Leadership", "Agile", "Problem Solving"] },
];

const degreeOptions = ["High School", "Associate", "B.Tech", "Master's", "MBA", "Phd", "Diploma", "B.Sc", "M.Tech", "BCA", "MCA"];

const employmentOptions = [
  { title: "Full-time", copy: "40 hrs/week · benefits", icon: Briefcase },
  { title: "Part-time", copy: "Flexible · up to 20 hrs", icon: Clock },
  { title: "Freelance / Contract", copy: "Project-based", icon: Users },
  { title: "Internship", copy: "Learning-focused", icon: GraduationCap },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<RegisterStep>(0);

  // Step 0: Initial Register
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stepLoading, setStepLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Employment
  const [employment, setEmployment] = useState<string[]>([]);

  // Step 2: Skills
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkills, setCustomSkills] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState("");
  const [customSkill, setCustomSkill] = useState("");
  const [showCustomSkill, setShowCustomSkill] = useState(false);

  // Step 3: Education
  const [selectedDegree, setSelectedDegree] = useState("");
  const [degreeSearch, setDegreeSearch] = useState("");
  const [institution, setInstitution] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [grade, setGrade] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");

  // Step 4: Address
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Step 5: Resume & Portfolio
  const [workFiles, setWorkFiles] = useState<UploadFile[]>([]);
  const [resumeFiles, setResumeFiles] = useState<UploadFile[]>([]);
  const [portfolioLink, setPortfolioLink] = useState("");

  const next = () => {
    setError("");
    setStep((current) => Math.min(current + 1, 6) as RegisterStep);
  };
  const back = () => {
    setError("");
    setStep((current) => Math.max(current - 1, 0) as RegisterStep);
  };

  // Step 0 handler: Initial Register + initial profile update
  const handleInitialRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !contactNumber.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (name.trim().length < 3) {
      setError("Name must be at least 3 characters long.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    const phoneRegex = /^[+]?[\d\s-]{7,20}$/;
    if (!phoneRegex.test(contactNumber.trim())) {
      setError("Please enter a valid contact number (7 to 20 digits).");
      return;
    }

    if (!agreedToTerms) {
      setError("Please agree to the Terms & Privacy Policy to proceed.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await authService.register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (res && res.payload && res.payload.token) {
        localStorage.setItem("candidate_token", res.payload.token);
        if (res.payload.candidateId) {
          localStorage.setItem("candidate_id", res.payload.candidateId);
        }

        // Save contact number immediately using PUT /api/Candidate/profile/update
        try {
          await profileService.updateProfile({
            candidateId: res.payload.candidateId,
            name: name.trim(),
            contactNumber: contactNumber.trim(),
          });
        } catch (updateErr) {
          console.warn("Could not save initial contact number on register", updateErr);
        }
        toast.success("Account Created!", "Welcome to Voctrum Candidate Portal.");
      }
      next();
    } catch (err: any) {
      const errorMsg = err.message || "Failed to register. Please try again.";
      setError(errorMsg);
      toast.error("Registration Notice", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2 handler: Save skills using PUT /api/Candidate/profile/update
  const handleSaveSkills = async () => {
    setError("");
    setStepLoading(true);
    try {
      if (skills.length > 0) {
        await profileService.updateProfile({ skills });
      }
      next();
    } catch (err: any) {
      setError(err.message || "Failed to save skills. Please try again.");
    } finally {
      setStepLoading(false);
    }
  };

  // Step 3 handler: Save education using PUT /api/Candidate/profile/update
  const handleSaveEducation = async () => {
    setError("");

    // If candidate has entered any education info, validate and persist it
    if (institution.trim() || selectedDegree || fieldOfStudy.trim()) {
      if (!institution.trim()) {
        setError("Please enter the Institution or University name.");
        return;
      }
      const degreeTitle = selectedDegree
        ? `${selectedDegree}${fieldOfStudy.trim() ? ` in ${fieldOfStudy.trim()}` : ""}`
        : fieldOfStudy.trim() || "Graduate Degree";

      const educationItem = {
        institution: institution.trim(),
        degree: degreeTitle,
        grade: grade.trim() || null,
        yearOfPassing: endYear ? parseInt(endYear.slice(0, 4), 10) || null : null,
        startDate: startYear ? new Date(startYear).toISOString() : null,
        endDate: endYear ? new Date(endYear).toISOString() : null,
      };

      setStepLoading(true);
      try {
        await profileService.updateProfile({ educations: [educationItem] });
        next();
      } catch (err: any) {
        setError(err.message || "Failed to save education details.");
      } finally {
        setStepLoading(false);
      }
    } else {
      // Optional: proceed if candidate wants to skip education for now
      next();
    }
  };

  // Step 4 handler: Save address details using PUT /api/Candidate/profile/update
  const handleSaveAddress = async () => {
    setError("");

    const validation = validateProfileUpdate({
      addressLine1: addressLine1.trim() || undefined,
      addressLine2: addressLine2.trim() || undefined,
      city: city.trim() || undefined,
      state: state.trim() || undefined,
      country: country.trim() || undefined,
      postalCode: postalCode.trim() || undefined,
    });

    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setError(firstError);
      return;
    }

    setStepLoading(true);
    try {
      await profileService.updateProfile({
        addressLine1: addressLine1.trim() || null,
        addressLine2: addressLine2.trim() || null,
        city: city.trim() || null,
        state: state.trim() || null,
        country: country.trim() || null,
        postalCode: postalCode.trim() || null,
      });
      next();
    } catch (err: any) {
      setError(err.message || "Failed to save address details.");
    } finally {
      setStepLoading(false);
    }
  };

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
    <main className="min-h-screen bg-white dark:bg-[#1a1a1a] text-[#101828] dark:text-white">
      <AuthHeader />
      {step === 0 ? (
        <GetStarted
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          contactNumber={contactNumber}
          setContactNumber={setContactNumber}
          agreedToTerms={agreedToTerms}
          setAgreedToTerms={setAgreedToTerms}
          loading={loading}
          error={error}
          onRegister={handleInitialRegister}
        />
      ) : (
        <section className="relative min-h-[calc(100vh-70px)] overflow-hidden bg-[#fbfbfc] dark:bg-[#0a0a0a] px-5 py-14">
          <RegisterBackground />
          <div className="relative mx-auto w-full max-w-[930px] rounded-2xl bg-[#f7f7f8]/95 dark:bg-[#1a1a1a]/95 px-8 py-10 shadow-lg border border-slate-200/80 dark:border-slate-800 md:px-14">
            {error && (
              <div className="mb-6 flex items-center gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-3.5 text-sm font-medium text-rose-800 dark:text-rose-300">
                <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {step === 1 && (
              <EmploymentPreference
                selected={employment}
                onToggle={toggleEmployment}
                onBack={back}
                onNext={next}
              />
            )}

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
                onNext={handleSaveSkills}
                loading={stepLoading}
              />
            )}

            {step === 3 && (
              <EducationStep
                selectedDegree={selectedDegree}
                search={degreeSearch}
                onSearch={setDegreeSearch}
                onSelectDegree={setSelectedDegree}
                institution={institution}
                onInstitutionChange={setInstitution}
                fieldOfStudy={fieldOfStudy}
                onFieldOfStudyChange={setFieldOfStudy}
                grade={grade}
                onGradeChange={setGrade}
                startYear={startYear}
                onStartYearChange={setStartYear}
                endYear={endYear}
                onEndYearChange={setEndYear}
                onBack={back}
                onNext={handleSaveEducation}
                loading={stepLoading}
              />
            )}

            {step === 4 && (
              <AddressStep
                addressLine1={addressLine1}
                onAddressLine1Change={setAddressLine1}
                addressLine2={addressLine2}
                onAddressLine2Change={setAddressLine2}
                city={city}
                onCityChange={setCity}
                state={state}
                onStateChange={setState}
                country={country}
                onCountryChange={setCountry}
                postalCode={postalCode}
                onPostalCodeChange={setPostalCode}
                onBack={back}
                onNext={handleSaveAddress}
                loading={stepLoading}
              />
            )}

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

            {step === 6 && (
              <DoneStep
                selectedSkills={skills.length}
                employment={employment[0] || "Flexible"}
                educationAdded={Boolean(institution || selectedDegree)}
                addressCity={city || "Completed"}
                onBack={back}
              />
            )}
          </div>
        </section>
      )}
    </main>
  );
}

function AuthHeader() {
  return (
    <header className="flex h-[70px] items-center justify-between border-b border-[#eef0f4] dark:border-slate-800 bg-white dark:bg-[#1a1a1a] px-8 shadow-xs sm:px-14">
      <Link href="/" aria-label="Voctrum home" className="flex items-center">
        <Image src="/common/logo.png" alt="Voctrum" width={118} height={38} className="h-auto w-[118px] object-contain" priority />
      </Link>
      <div className="flex items-center gap-3 text-sm text-[#667085] dark:text-slate-400 sm:text-base">
        <span className="hidden sm:inline">Already have an account?</span>
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

function GetStarted({
  onRegister,
  name, setName,
  email, setEmail,
  password, setPassword,
  contactNumber, setContactNumber,
  agreedToTerms, setAgreedToTerms,
  loading, error
}: {
  onRegister: () => void;
  name?: string; setName?: (v: string) => void;
  email?: string; setEmail?: (v: string) => void;
  password?: string; setPassword?: (v: string) => void;
  contactNumber?: string; setContactNumber?: (v: string) => void;
  agreedToTerms?: boolean; setAgreedToTerms?: (v: boolean) => void;
  loading?: boolean; error?: string;
}) {
  return (
    <section className="grid min-h-[calc(100vh-70px)] grid-cols-1 lg:grid-cols-2">
      <aside className="flex items-center justify-center bg-[#f8f8f9] dark:bg-slate-900 px-8 py-12 lg:px-14">
        <div className="w-full max-w-[520px]">
          <h1 className="text-center text-3xl font-extrabold text-[#101828] dark:text-white">
            V<span className="text-[#2f54eb]">octrum</span>
          </h1>
          <p className="mt-4 text-center text-sm text-[#98a2b3]">Create your account to explore opportunities that match your ambitions</p>
          <div className="mx-auto mt-12 max-w-[420px]">
            <h2 className="text-lg font-extrabold uppercase text-[#101828] dark:text-white">How It Works</h2>
            <div className="mt-8 space-y-10">
              <HowItWorksItem number="1" title="Create your profile" copy="Add your skills and experience to get matched opportunities" />
              <HowItWorksItem number="2" title="Discover matching roles" copy="Browse curated jobs and find roles that match your experience" />
              <HowItWorksItem number="3" title="Get Hired" copy="Apply, track progress and land your next role" />
            </div>
          </div>
          <p className="mt-20 text-center text-sm font-medium italic text-[#2f54eb]">&quot; Takes less than 2 minutes to get started &quot;</p>
        </div>
      </aside>

      <section className="flex items-center justify-center px-8 py-12 lg:px-14">
        <form className="w-full max-w-[520px]" onSubmit={(event) => { event.preventDefault(); onRegister(); }}>
          <div className="mb-9 text-center">
            <h2 className="text-4xl font-extrabold text-[#101828] dark:text-white">Get Started</h2>
            <p className="mt-4 text-sm text-[#98a2b3]">Register to start exploring jobs and build your future</p>
          </div>

          {error && <div className="mb-4 rounded-md bg-red-50 dark:bg-red-950/40 p-3 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">{error}</div>}

          <LineInput icon={<User className="h-5 w-5" />} placeholder="Full Name *" value={name} onChange={(e) => setName?.(e.target.value)} />
          <LineInput icon={<Mail className="h-5 w-5" />} placeholder="Email Address *" type="email" value={email} onChange={(e) => setEmail?.(e.target.value)} />
          <LineInput icon={<Lock className="h-5 w-5" />} placeholder="Password (min 6 characters) *" type="password" value={password} onChange={(e) => setPassword?.(e.target.value)} />
          <LineInput icon={<User className="h-5 w-5" />} placeholder="Contact Number (e.g. 9876543210) *" type="tel" value={contactNumber} onChange={(e) => setContactNumber?.(e.target.value)} />

          <label className="mt-6 flex items-center gap-3 text-sm text-[#475467] dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms?.(e.target.checked)}
              className="h-4 w-4 rounded border-[#d0d5dd] accent-[#2f54eb]"
            />
            I agree to the Terms &amp; Privacy Policy
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-[#2f54eb] text-lg font-bold text-white transition hover:bg-[#2447d8] disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Creating Account...
              </>
            ) : (
              "Register & Continue"
            )}
          </button>
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
        <span className="block text-base font-bold text-[#667085] dark:text-slate-300">{title}</span>
        <span className="mt-1 block max-w-[360px] text-sm leading-6 text-[#98a2b3]">{copy}</span>
      </span>
    </div>
  );
}

type StepProps = { onBack: () => void; onNext: () => void; loading?: boolean };

function EmploymentPreference({ selected, onToggle, onBack, onNext }: StepProps & { selected: string[]; onToggle: (value: string) => void }) {
  return (
    <>
      <StepHeading title="Employment Preference" copy="What type of work fits your lifestyle best?" step={1} percent={15} filled={0} />
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {employmentOptions.map((option) => {
          const Icon = option.icon;
          const checked = selected.includes(option.title);
          return (
            <label key={option.title} className="flex h-[78px] cursor-pointer items-center justify-between rounded-lg border border-[#dfe3ea] dark:border-slate-700 bg-white dark:bg-[#1a1a1a] px-5 text-left shadow-sm transition hover:border-[#2f54eb]">
              <span className="flex items-center gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#e9edff] dark:bg-slate-800 text-[#2f54eb]">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-base font-semibold text-[#101828] dark:text-white">{option.title}</span>
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
  loading,
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
      <StepHeading title="Your Skills" copy="Select skills that represent your expertise" step={2} percent={35} filled={1} />
      <SearchBox placeholder="Search Skill..." value={search} onChange={onSearch} />
      <div className="mt-7 space-y-6">
        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-4 text-base font-semibold text-[#475467] dark:text-slate-300">{group.title}</h3>
            <div className="flex flex-wrap gap-3">
              {group.skills.map((skill) => (
                <Pill key={skill} label={skill} selected={selected.includes(skill)} onClick={() => onToggle(skill)} />
              ))}
            </div>
          </div>
        ))}
      </div>
      {showCustomSkill ? (
        <div className="mt-6 flex max-w-[560px] gap-3">
          <input
            value={customSkill}
            onChange={(event) => onCustomSkill(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && onAddCustomSkill()}
            placeholder="Enter custom skill"
            className="h-11 min-w-0 flex-1 rounded-lg border border-[#d0d5dd] dark:border-slate-700 bg-white dark:bg-[#1a1a1a] px-4 text-sm text-slate-900 dark:text-white outline-none placeholder:text-[#98a2b3]"
          />
          <button type="button" onClick={onAddCustomSkill} className="h-11 rounded-lg bg-[#2f54eb] px-5 text-sm font-bold text-white transition hover:bg-[#2447d8]">Add</button>
        </div>
      ) : (
        <button type="button" onClick={onShowCustomSkill} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#475467] dark:text-slate-300 hover:text-[#2f54eb]">
          <Plus className="h-4 w-4 text-[#2f54eb]" />
          Add Custom Skills
        </button>
      )}
      <StepActions onBack={onBack} onNext={onNext} loading={loading} />
    </>
  );
}

function EducationStep({
  selectedDegree,
  search,
  onSearch,
  onSelectDegree,
  institution,
  onInstitutionChange,
  fieldOfStudy,
  onFieldOfStudyChange,
  grade,
  onGradeChange,
  startYear,
  onStartYearChange,
  endYear,
  onEndYearChange,
  onBack,
  onNext,
  loading,
}: StepProps & {
  selectedDegree: string;
  search: string;
  onSearch: (value: string) => void;
  onSelectDegree: (value: string) => void;
  institution: string;
  onInstitutionChange: (v: string) => void;
  fieldOfStudy: string;
  onFieldOfStudyChange: (v: string) => void;
  grade: string;
  onGradeChange: (v: string) => void;
  startYear: string;
  onStartYearChange: (v: string) => void;
  endYear: string;
  onEndYearChange: (v: string) => void;
}) {
  const filteredDegrees = degreeOptions.filter((degree) => degree.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <>
      <StepHeading title="Add Education" copy="Add your academic background and qualifications" step={3} percent={55} filled={2} />
      <SearchBox placeholder="Search Degree..." value={search} onChange={onSearch} />
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-[#475467] dark:text-slate-300">Degree / Qualification</h3>
        <div className="flex flex-wrap gap-2.5">
          {filteredDegrees.map((degree) => (
            <Pill
              key={degree}
              label={degree}
              selected={selectedDegree === degree}
              onClick={() => onSelectDegree(selectedDegree === degree ? "" : degree)}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <Field
          label="Institution / University *"
          placeholder="e.g. Stanford University or NIT Srinagar"
          value={institution}
          onChange={onInstitutionChange}
        />
        <Field
          label="Field of Study"
          placeholder="e.g. Computer Science & Engineering"
          value={fieldOfStudy}
          onChange={onFieldOfStudyChange}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label="Start Date"
            type="date"
            placeholder="Select start date"
            value={startYear}
            onChange={onStartYearChange}
          />
          <Field
            label="End Date / Passing"
            type="date"
            placeholder="Select end date"
            value={endYear}
            onChange={onEndYearChange}
          />
          <Field
            label="Grade / GPA"
            placeholder="e.g. 3.8 GPA or 85%"
            value={grade}
            onChange={onGradeChange}
          />
        </div>
      </div>

      <StepActions onBack={onBack} onNext={onNext} loading={loading} />
    </>
  );
}

function AddressStep({
  addressLine1,
  onAddressLine1Change,
  addressLine2,
  onAddressLine2Change,
  city,
  onCityChange,
  state,
  onStateChange,
  country,
  onCountryChange,
  postalCode,
  onPostalCodeChange,
  onBack,
  onNext,
  loading,
}: StepProps & {
  addressLine1: string;
  onAddressLine1Change: (v: string) => void;
  addressLine2: string;
  onAddressLine2Change: (v: string) => void;
  city: string;
  onCityChange: (v: string) => void;
  state: string;
  onStateChange: (v: string) => void;
  country: string;
  onCountryChange: (v: string) => void;
  postalCode: string;
  onPostalCodeChange: (v: string) => void;
}) {
  return (
    <>
      <StepHeading title="Address & Location" copy="Where are you currently located?" step={4} percent={75} filled={3} />
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field
            label="Street Address (Line 1)"
            placeholder="Street address, building, P.O. box"
            value={addressLine1}
            onChange={onAddressLine1Change}
            icon={<MapPin className="h-5 w-5 text-[#2f54eb]" />}
          />
        </div>

        <div className="sm:col-span-2">
          <Field
            label="Address Line 2 (Optional)"
            placeholder="Apartment, suite, unit, floor, etc."
            value={addressLine2}
            onChange={onAddressLine2Change}
          />
        </div>

        <Field
          label="City / Town"
          placeholder="e.g. Srinagar or New York"
          value={city}
          onChange={onCityChange}
        />

        <Field
          label="State / Province"
          placeholder="e.g. Jammu & Kashmir or California"
          value={state}
          onChange={onStateChange}
        />

        <Field
          label="Country"
          placeholder="e.g. India or United States"
          value={country}
          onChange={onCountryChange}
        />

        <Field
          label="Postal / ZIP Code"
          placeholder="e.g. 190001 or 94103"
          value={postalCode}
          onChange={onPostalCodeChange}
        />
      </div>

      <StepActions onBack={onBack} onNext={onNext} loading={loading} />
    </>
  );
}

function ResumeStep({ files, portfolioLink, onPortfolioLink, onAddFiles, onRemoveFile, onBack, onNext }: StepProps & { files: UploadFile[]; portfolioLink: string; onPortfolioLink: (value: string) => void; onAddFiles: (files: FileList | null) => void; onRemoveFile: (id: string) => void }) {
  return (
    <>
      <StepHeading title="Resume & Portfolio" copy="Let recruiters discover your work" step={5} percent={90} filled={4} />
      <div className="mx-auto mt-8 w-full max-w-[470px] rounded-xl bg-white dark:bg-[#1a1a1a] px-5 py-8 text-center shadow-md border border-slate-200 dark:border-slate-800">
        <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-[#e9edff] dark:bg-slate-800 text-[#2f54eb]">
          <Upload className="h-5 w-5" />
        </span>
        <h3 className="mt-4 text-base font-bold text-[#101828] dark:text-white">Click to Upload Resume</h3>
        <p className="mt-1 text-xs text-[#98a2b3]">PDF, DOC, DOCX up to 10 MB</p>
        <FilePicker id="resume-file" label="Browse Files" onChange={onAddFiles} />
        <FileList files={files} onRemove={onRemoveFile} />
      </div>
      <div className="mt-8">
        <Field label="Portfolio / LinkedIn URL" placeholder="https://linkedin.com/in/username" value={portfolioLink} onChange={onPortfolioLink} icon={<LinkIcon className="h-5 w-5 text-[#2f54eb]" />} />
      </div>
      <StepActions onBack={onBack} onNext={onNext} />
    </>
  );
}

function DoneStep({
  selectedSkills,
  employment,
  educationAdded,
  addressCity,
  onBack,
}: {
  selectedSkills: number;
  employment: string;
  educationAdded: boolean;
  addressCity: string;
  onBack: () => void;
}) {
  const redirectUrl = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('redirect') : null;
  const targetDestination = redirectUrl || "/dashboard";

  return (
    <>
      <StepHeading title="All Done!" copy="Your candidate profile is fully configured and updated" percent={100} filled={5} completeOnly />
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-white dark:bg-[#1a1a1a] px-8 py-9 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Check className="h-7 w-7 stroke-[3]" />
          </span>
          <h3 className="mt-5 text-lg font-bold text-[#2f54eb]">Profile Status</h3>
          <p className="mt-1 text-xl font-extrabold text-[#101828] dark:text-white">Profile Synced &amp; Active</p>
          <p className="mx-auto mt-2 max-w-[300px] text-xs leading-5 text-[#98a2b3]">
            Your extra details have been saved to your profile and you are ready to explore matching jobs.
          </p>
        </div>

        <div className="flex items-center gap-6 rounded-xl bg-white dark:bg-[#1a1a1a] px-8 py-9 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full border-[8px] border-[#16a34a] text-center">
            <span className="text-xs text-[#667085] dark:text-slate-400">
              <strong className="block text-base text-[#101828] dark:text-white">100%</strong> Complete
            </span>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#101828] dark:text-white">Ready for Applications</h3>
            <p className="mt-1 max-w-[250px] text-xs leading-5 text-[#667085] dark:text-slate-400">
              Recruiters can now view your verified skills, education, and address details.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        <SummaryCard value={`${selectedSkills}`} label="Skills Added" />
        <SummaryCard value={educationAdded ? "Verified" : "Pending"} label="Education" />
        <SummaryCard value={addressCity} label="Location" />
        <SummaryCard value={employment} label="Preference" />
      </div>

      <div className="mt-10 flex justify-end gap-4">
        <button type="button" onClick={onBack} className="h-11 w-32 rounded-lg border border-[#2f54eb] bg-white dark:bg-[#1a1a1a] text-sm font-bold text-[#2f54eb] transition hover:bg-[#eef3ff]">
          Back
        </button>
        <Link href={targetDestination} className="inline-flex h-11 items-center justify-center rounded-lg bg-[#2f54eb] px-8 text-sm font-bold !text-white transition hover:bg-[#2447d8] hover:!text-white shadow-md">
          {redirectUrl ? "Continue To Job / Resume" : "Explore Dashboard & Jobs"}
        </Link>
      </div>
    </>
  );
}

function StepHeading({ title, copy, step, percent, filled, completeOnly }: { title: string; copy: string; step?: number; percent: number; filled: number; completeOnly?: boolean }) {
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#101828] dark:text-white">{title}</h1>
      <p className="mt-1 text-sm text-[#98a2b3]">{copy}</p>
      <div className="mt-6 flex items-center justify-between gap-6">
        <div className="flex flex-1 gap-2.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index} className={`h-2 flex-1 rounded-full transition-all ${index < filled || completeOnly ? "bg-[#2f54eb]" : "bg-slate-200 dark:bg-slate-700"}`} />
          ))}
        </div>
        <span className="min-w-[170px] text-right text-xs font-bold text-[#101828] dark:text-white">
          {step ? <span className="font-semibold text-[#2f54eb]">Step {step} of 5</span> : null}
          {step ? " · " : null}
          {percent}%
        </span>
      </div>
    </div>
  );
}

function StepActions({ onBack, onNext, loading }: StepProps) {
  return (
    <div className="mt-12 flex justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
      <button
        type="button"
        onClick={onBack}
        disabled={loading}
        className="h-11 w-28 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] text-sm font-bold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
      >
        Back
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={loading}
        className="inline-flex h-11 min-w-[130px] items-center justify-center gap-2 rounded-lg bg-[#2f54eb] px-6 text-sm font-bold text-white transition hover:bg-[#2447d8] disabled:opacity-70 shadow-sm"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Saving...
          </>
        ) : (
          "Continue"
        )}
      </button>
    </div>
  );
}

function LineInput({ icon, placeholder, type = "text", trailing, value, onChange }: { icon: ReactNode; placeholder: string; type?: string; trailing?: ReactNode; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <label className="mt-6 flex h-11 items-center gap-3 border-b border-[#dfe3ea] dark:border-slate-700 text-[#2f54eb]">
      {icon}
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} className="min-w-0 flex-1 bg-transparent text-sm text-[#101828] dark:text-white outline-none placeholder:text-[#98a2b3]" />
      {trailing}
    </label>
  );
}

function SearchBox({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="mt-6 flex h-11 max-w-[560px] items-center gap-3 rounded-lg border border-[#d0d5dd] dark:border-slate-700 bg-white dark:bg-[#1a1a1a] px-4 text-[#2f54eb]">
      <Search className="h-4 w-4 text-slate-400" />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#667085] dark:text-slate-400" />
    </label>
  );
}

function Pill({ label, selected, onClick }: { label: string; selected?: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`h-8 rounded-full border px-5 text-xs font-semibold transition ${selected ? "border-[#2f54eb] bg-[#2f54eb] text-white" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] text-slate-700 dark:text-slate-300 hover:border-[#2f54eb] hover:text-[#2f54eb]"}`}>
      {label}
    </button>
  );
}

function Field({ label, placeholder, icon, type = "text", value, onChange }: { label: string; placeholder: string; icon?: ReactNode; type?: string; value?: string; onChange?: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</span>
      <span className="flex h-11 items-center gap-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] px-3.5 focus-within:border-[#2f54eb]">
        {icon}
        <input type={type} value={value} onChange={(event) => onChange?.(event.target.value)} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder:text-[#98a2b3]" />
      </span>
    </label>
  );
}

function FilePicker({ id, label, icon, onChange }: { id: string; label: string; icon?: ReactNode; onChange: (files: FileList | null) => void }) {
  return (
    <label htmlFor={id} className="mx-auto mt-4 inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-[#2f54eb] px-5 text-xs font-bold text-white transition hover:bg-[#2447d8]">
      {icon}
      {label}
      <input id={id} type="file" multiple className="sr-only" onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.files)} />
    </label>
  );
}

function FileList({ files, onRemove }: { files: UploadFile[]; onRemove: (id: string) => void }) {
  if (!files.length) return null;
  return (
    <div className="mt-4 space-y-2.5">
      {files.map((file) => <UploadRow key={file.id} file={file} onRemove={() => onRemove(file.id)} />)}
    </div>
  );
}

function UploadRow({ file, onRemove }: { file: UploadFile; onRemove: () => void }) {
  return (
    <div className="group relative rounded-lg bg-[#f4f4f5] dark:bg-slate-800 px-3.5 py-2.5 text-left">
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 shrink-0 text-[#b38a00]" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-xs font-semibold text-[#101828] dark:text-white">{file.name}</p>
            <button type="button" onClick={onRemove} aria-label={`Remove ${file.name}`} className="text-red-500 transition hover:text-red-600">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[#98a2b3]">
            <span>{formatFileSize(file.size)}</span>
            <span>·</span>
            <span className="text-[#16a34a]">Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-[#f8f9ff] dark:bg-slate-800/60 p-4">
      <p className="text-base font-extrabold text-[#2f54eb] dark:text-blue-400">{value}</p>
      <p className="mt-1 text-xs text-[#667085] dark:text-slate-400">{label}</p>
    </div>
  );
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
