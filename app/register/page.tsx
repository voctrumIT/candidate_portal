"use client";

import Image from "next/image";
import Link from "next/link";
import type { ChangeEvent, ReactNode } from "react";
import { useMemo, useState, useRef, useEffect } from "react";
import {
  Briefcase,
  CalendarDays,
  Check,
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
  Edit2,
  Sparkles,
  Building2,
  ArrowLeft,
  RotateCw,
} from "lucide-react";
import { authService } from "../../services/auth";
import {
  profileService,
  validateProfileUpdate,
  formatExperienceForApi,
  WorkExperienceDto,
} from "../../services/profile";
import { documentsService } from "../../services/documents";
import { useRouter } from "next/navigation";
import { toast } from "../components/Toast";
import { useAuth } from "../../context/AuthContext";
import { getUserFriendlyErrorMessage } from "../../lib/errorUtils";
import {
  parseResumeFile,
  validateResumeCandidateName,
  ParsedResumeData,
  ParsedResumeExperience,
} from "../../lib/resumeParser";

type RegisterStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type UploadFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  rawFile?: File;
};

const initialSkillGroups = [
  { title: "Design", skills: ["UI Design", "Figma", "Prototyping", "Illustrator", "Motion"] },
  { title: "Development", skills: ["React", "Vue.js", "TypeScript", "Node.js", "Python", "SQL"] },
  { title: "Soft Skills", skills: ["Communication", "Leadership", "Agile", "Problem Solving"] },
];

const degreeOptions = [
  "High School",
  "Associate",
  "B.Tech",
  "Master's",
  "MBA",
  "Phd",
  "Diploma",
  "B.Sc",
  "M.Tech",
  "BCA",
  "MCA",
];

const employmentOptions = [
  { title: "Full-time", copy: "40 hrs/week · benefits", icon: Briefcase },
  { title: "Part-time", copy: "Flexible · up to 20 hrs", icon: Clock },
  { title: "Freelance / Contract", copy: "Project-based", icon: Users },
  { title: "Internship", copy: "Learning-focused", icon: GraduationCap },
];

export default function RegisterPage() {
  const router = useRouter();
  const { tenant } = useAuth();
  const [step, setStep] = useState<RegisterStep>(0);

  // Step 0: Initial Register
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [stepLoading, setStepLoading] = useState(false);
  const [error, setError] = useState("");

  // OTP Verification state (5min TTL)
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimeLeft, setOtpTimeLeft] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [resendingOtp, setResendingOtp] = useState(false);

  // Timer effect for OTP expiry and resend cooldown
  useEffect(() => {
    if (!otpSent) return;

    const interval = setInterval(() => {
      setOtpTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [otpSent]);

  // Step 1: Employment Preference (Job Type)
  const [employment, setEmployment] = useState<string[]>([]);

  // Step 2: Resume & Extracted status
  const [resumeFiles, setResumeFiles] = useState<UploadFile[]>([]);
  const [portfolioLink, setPortfolioLink] = useState("");
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [resumeParseNotice, setResumeParseNotice] = useState<string | null>(null);
  const [extractedSkillsList, setExtractedSkillsList] = useState<string[]>([]);

  // Step 3: Skills
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkills, setCustomSkills] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState("");
  const [customSkill, setCustomSkill] = useState("");
  const [showCustomSkill, setShowCustomSkill] = useState(false);

  // Step 4: Work Experience
  const [workExperiences, setWorkExperiences] = useState<ParsedResumeExperience[]>([]);
  const [isFresher, setIsFresher] = useState(false);

  // Step 5: Education
  const [selectedDegree, setSelectedDegree] = useState("");
  const [degreeSearch, setDegreeSearch] = useState("");
  const [institution, setInstitution] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [grade, setGrade] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");

  // Step 6: Address
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const next = () => {
    setError("");
    setStep((current) => Math.min(current + 1, 7) as RegisterStep);
  };

  const back = () => {
    setError("");
    setStep((current) => Math.max(current - 1, 0) as RegisterStep);
  };

  const validateStep0 = () => {
    const errs: Record<string, string> = {};
    const trimmedName = name.trim();
    if (!trimmedName) {
      errs.name = "Full name is required.";
    } else if (trimmedName.length < 3) {
      errs.name = "Full name must be at least 3 characters.";
    }

    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      errs.email = "Email address is required.";
    } else if (!emailRegex.test(trimmedEmail)) {
      errs.email = "Please enter a valid email address (e.g. name@example.com).";
    }

    if (!password) {
      errs.password = "Password is required.";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters long.";
    }

    const trimmedPhone = contactNumber.trim();
    const phoneRegex = /^[+]?[\d\s-]{7,20}$/;
    if (!trimmedPhone) {
      errs.contactNumber = "Contact number is required.";
    } else if (!phoneRegex.test(trimmedPhone)) {
      errs.contactNumber = "Please enter a valid contact number (7 to 20 digits).";
    }

    if (!agreedToTerms) {
      errs.terms = "Please accept the Terms & Privacy Policy to proceed.";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 0 - Action 1: Send OTP to Candidate's Email
  const handleSendOtp = async () => {
    setError("");
    if (!validateStep0()) {
      return;
    }

    setLoading(true);
    try {
      await authService.sendOtp({ email: email.trim() });
      setOtp("");
      setOtpSent(true);
      setOtpTimeLeft(300);
      setResendCooldown(60);
      toast.info("Verification Code Sent", `A 6-digit verification code has been sent to ${email.trim()}`);
    } catch (err: any) {
      const errorMsg = getUserFriendlyErrorMessage(err, "register");
      setError(errorMsg);
      toast.error("Notice", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Step 0 - Action 2: Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resendingOtp) return;
    setError("");
    setResendingOtp(true);
    try {
      await authService.sendOtp({ email: email.trim() });
      setOtp("");
      setOtpTimeLeft(300);
      setResendCooldown(60);
      toast.info("New Code Sent", `A new 6-digit verification code was sent to ${email.trim()}`);
    } catch (err: any) {
      const errorMsg = getUserFriendlyErrorMessage(err, "register");
      setError(errorMsg);
      toast.error("Resend Notice", errorMsg);
    } finally {
      setResendingOtp(false);
    }
  };

  // Step 0 - Action 3: Verify OTP & Register Account -> Advance to Step 1 (Job Type)
  const handleVerifyOtpAndRegister = async () => {
    setError("");
    const cleanOtp = otp.trim();
    if (!cleanOtp) {
      setError("Please enter the 6-digit verification code sent to your email.");
      return;
    }
    if (cleanOtp.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }
    if (otpTimeLeft === 0) {
      setError("Your verification code has expired. Please click 'Resend Code' to request a new one.");
      return;
    }

    setLoading(true);
    try {
      // Register candidate account with OTP verification
      const res = await authService.register({
        name: name.trim(),
        email: email.trim(),
        password,
        otp: cleanOtp,
        contactNumber: contactNumber.trim(),
      });

      const payload = res?.payload || res?.Payload || res;
      const token = payload?.token || payload?.Token;
      const candidateId = payload?.candidateId || payload?.CandidateId;

      if (token) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("candidate_active_resume_id");
          localStorage.removeItem("candidate_active_resume_name");
          localStorage.removeItem("candidate_active_resume_url");
          localStorage.removeItem("candidate_active_resume");
          localStorage.removeItem("candidate_active_resume_owner_id");
          localStorage.removeItem("candidate_about_me");
          localStorage.removeItem("candidate_work_experience");
          localStorage.removeItem("candidate_address");
          localStorage.setItem("candidate_token", token);
          if (candidateId) {
            localStorage.setItem("candidate_id", candidateId);
          }
        }

        // 3. Save initial contact number and name to candidate profile
        try {
          await profileService.updateProfile({
            candidateId: candidateId,
            name: name.trim(),
            contactNumber: contactNumber.trim(),
          });
        } catch (updateErr) {
          console.warn("Could not save initial contact number on register", updateErr);
        }

        toast.success("Email Verified & Account Created!", `Welcome to ${tenant?.companyName || "Voctrum"} Candidate Portal.`);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("candidate_profile_updated"));
          window.dispatchEvent(new Event("storage"));
        }
      }

      // Proceed immediately to Step 1: Select Job Type
      next();
    } catch (err: any) {
      const errorMsg = getUserFriendlyErrorMessage(err, "register");
      setError(errorMsg);
      toast.error("Verification Notice", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Step 1 handler: Save Employment Preference (Job Type)
  const handleSaveEmployment = async () => {
    setError("");
    if (employment.length === 0) {
      const msg = "Please select at least one job type (e.g. Full-time, Part-time, Contract, Internship).";
      setError(msg);
      toast.warning("Job Type Required", "Select at least one employment preference to proceed.");
      return;
    }

    setStepLoading(true);
    try {
      await profileService.updateProfile({
        preferredWorkLocation: employment.join(", "),
      });
      next();
    } catch (err: any) {
      console.warn("Preference save notice:", err);
      next();
    } finally {
      setStepLoading(false);
    }
  };

  // Step 2 Resume Upload & Parser handler
  const handleResumeAdded = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const newFile: UploadFile = {
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      size: file.size,
      type: file.type || "application/pdf",
      url: URL.createObjectURL(file),
      rawFile: file,
    };

    setResumeFiles([newFile]);
    setError("");
    setIsParsingResume(true);
    setResumeParseNotice(null);

    try {
      const parsed: ParsedResumeData = await parseResumeFile(file);

      // Validation: Verify if the name entered during registration matches the resume
      const nameValidation = validateResumeCandidateName(
        parsed.fullText || parsed.rawTextPreview || "",
        name
      );

      if (!nameValidation.matches) {
        if (newFile.url) URL.revokeObjectURL(newFile.url);
        setResumeFiles([]);
        setResumeParseNotice(null);
        const errorMsg =
          nameValidation.reason ||
          `The name on the uploaded resume does not match your registered name ("${name}"). Please ensure you upload your own resume.`;
        setError(errorMsg);
        toast.error("Resume Verification Failed", errorMsg);
        return;
      }

      const detected = parsed.skills || [];
      if (detected.length > 0) {
        setExtractedSkillsList(detected);
        setSkills((curr) => Array.from(new Set([...curr, ...detected])));
        const defaultSkillsSet = new Set(initialSkillGroups.flatMap((g) => g.skills.map((s: string) => s.toLowerCase())));
        const customs = detected.filter((s: string) => !defaultSkillsSet.has(s.toLowerCase()));
        if (customs.length > 0) {
          setCustomSkills((curr) => Array.from(new Set([...curr, ...customs])));
        }
      }

      if (parsed.education) {
        if (parsed.education.degree) setSelectedDegree(parsed.education.degree);
        if (parsed.education.institution) setInstitution(parsed.education.institution);
        if (parsed.education.fieldOfStudy) setFieldOfStudy(parsed.education.fieldOfStudy);
        if (parsed.education.grade) setGrade(parsed.education.grade);
        if (parsed.education.startDate) setStartYear(parsed.education.startDate);
        if (parsed.education.endDate) setEndYear(parsed.education.endDate);
      }

      if (parsed.experiences && parsed.experiences.length > 0) {
        setWorkExperiences(parsed.experiences);
        setIsFresher(false);
      }

      if (parsed.address) {
        if (parsed.address.addressLine1 && !addressLine1) setAddressLine1(parsed.address.addressLine1);
        if (parsed.address.city && !city) setCity(parsed.address.city);
        if (parsed.address.state && !state) setState(parsed.address.state);
        if (parsed.address.country && !country) setCountry(parsed.address.country);
        if (parsed.address.postalCode && !postalCode) setPostalCode(parsed.address.postalCode);
      }

      const summaryParts = [];
      if (detected.length > 0) summaryParts.push(`${detected.length} skills`);
      if (parsed.experiences && parsed.experiences.length > 0) summaryParts.push(`${parsed.experiences.length} experience role(s)`);
      if (parsed.education?.degree) summaryParts.push(parsed.education.degree);
      if (parsed.address?.city) summaryParts.push(parsed.address.city);

      const notice = summaryParts.length > 0
        ? `Extracted ${summaryParts.join(", ")} to prefill your profile.`
        : "Resume details analyzed and ready for verification.";

      setResumeParseNotice(notice);
      toast.success("Resume Analyzed!", "Key profile details extracted and prefilled for your review.");
    } catch (parseErr) {
      console.warn("Resume parsing notice:", parseErr);
      setResumeParseNotice("Resume uploaded. You can review and fill in your details in the upcoming steps.");
    } finally {
      setIsParsingResume(false);
    }
  };

  const handleSaveResume = async () => {
    setError("");
    if (resumeFiles.length === 0) {
      const msg = "Resume is compulsory. Please upload your resume in PDF, DOC, or DOCX format to proceed.";
      setError(msg);
      toast.warning("Resume Required", "Please upload your resume before proceeding.");
      return;
    }

    setStepLoading(true);
    try {
      const fileObj = resumeFiles[0];
      if (fileObj && fileObj.rawFile) {
        const formData = new FormData();
        formData.append("file", fileObj.rawFile);
        formData.append("File", fileObj.rawFile);
        formData.append("DocumentType", "Resume");
        formData.append("type", "Resume");
        const cid = typeof window !== "undefined" ? localStorage.getItem("candidate_id") : null;
        if (cid) {
          formData.append("CandidateId", cid);
        }
        const uploadRes = await documentsService.uploadDocument(formData);
        const doc = uploadRes?.payload || uploadRes;
        const docId = doc?.fileUrl || doc?.id || fileObj.name;
        if (typeof window !== "undefined") {
          localStorage.setItem("candidate_active_resume_id", docId);
          localStorage.setItem("candidate_active_resume_name", fileObj.name);
          if (cid) {
            localStorage.setItem("candidate_active_resume_owner_id", cid);
          }
          if (doc?.fileUrl) {
            localStorage.setItem("candidate_active_resume_url", doc.fileUrl);
          }
          window.dispatchEvent(
            new CustomEvent("active_resume_updated", {
              detail: { id: docId, name: fileObj.name, fileUrl: doc?.fileUrl },
            })
          );
          window.dispatchEvent(new CustomEvent("candidate_profile_updated"));
          window.dispatchEvent(new Event("storage"));
        }
      }
      next();
    } catch (err: any) {
      console.warn("Resume upload during registration notice:", err);
      next();
    } finally {
      setStepLoading(false);
    }
  };

  // Step 3 handler: Save Skills
  const handleSaveSkills = async () => {
    setError("");
    if (skills.length === 0) {
      const msg = "Please select at least 1 skill to proceed.";
      setError(msg);
      toast.warning("Skill Required", "Select or enter at least one skill representing your expertise.");
      return;
    }

    setStepLoading(true);
    try {
      await profileService.updateProfile({ skills });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("candidate_profile_updated"));
        window.dispatchEvent(new Event("storage"));
      }
      next();
    } catch (err: any) {
      setError(getUserFriendlyErrorMessage(err, "register"));
    } finally {
      setStepLoading(false);
    }
  };

  // Step 4 handler: Save Work Experience
  const handleSaveWorkExperience = async () => {
    setError("");

    if (!isFresher && workExperiences.length > 0) {
      setStepLoading(true);
      try {
        const formattedList = workExperiences
          .map((exp) => formatExperienceForApi(exp))
          .filter(Boolean) as WorkExperienceDto[];

        if (formattedList.length > 0) {
          await profileService.updateProfile({
            workExperiences: formattedList,
          });
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("candidate_profile_updated"));
            window.dispatchEvent(new Event("storage"));
          }
        }
        next();
      } catch (err: any) {
        setError(getUserFriendlyErrorMessage(err, "register"));
      } finally {
        setStepLoading(false);
      }
    } else {
      next();
    }
  };

  // Step 5 handler: Save Education
  const handleSaveEducation = async () => {
    setError("");

    if (institution.trim() || selectedDegree || fieldOfStudy.trim()) {
      if (!institution.trim()) {
        setError("Please enter your Institution or University name.");
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
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("candidate_profile_updated"));
          window.dispatchEvent(new Event("storage"));
        }
        next();
      } catch (err: any) {
        setError(getUserFriendlyErrorMessage(err, "register"));
      } finally {
        setStepLoading(false);
      }
    } else {
      next();
    }
  };

  // Step 6 handler: Save Address
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
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("candidate_profile_updated"));
        window.dispatchEvent(new Event("storage"));
      }
      next();
    } catch (err: any) {
      setError(getUserFriendlyErrorMessage(err, "register"));
    } finally {
      setStepLoading(false);
    }
  };

  const toggleEmployment = (title: string) => {
    setEmployment((current) =>
      current.includes(title) ? current.filter((item) => item !== title) : [...current, title]
    );
  };

  const toggleSkill = (skill: string) => {
    setSkills((current) =>
      current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill]
    );
  };

  const addCustomSkill = () => {
    const value = customSkill.trim();
    if (!value) return;
    setCustomSkills((current) =>
      current.some((item) => item.toLowerCase() === value.toLowerCase()) ? current : [...current, value]
    );
    setSkills((current) =>
      current.some((item) => item.toLowerCase() === value.toLowerCase()) ? current : [...current, value]
    );
    setCustomSkill("");
    setShowCustomSkill(false);
  };

  const removeResumeFile = (id: string) => {
    const file = resumeFiles.find((item) => item.id === id);
    if (file?.url) URL.revokeObjectURL(file.url);
    setResumeFiles([]);
    setResumeParseNotice(null);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#1a1a1a] text-[#101828] dark:text-white">
      <AuthHeader />
      {step === 0 ? (
        <GetStarted
          name={name}
          setName={(v) => {
            setName(v);
            if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: "" }));
          }}
          email={email}
          setEmail={(v) => {
            setEmail(v);
            if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }));
          }}
          password={password}
          setPassword={(v) => {
            setPassword(v);
            if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: "" }));
          }}
          contactNumber={contactNumber}
          setContactNumber={(v) => {
            setContactNumber(v);
            if (fieldErrors.contactNumber) setFieldErrors((prev) => ({ ...prev, contactNumber: "" }));
          }}
          agreedToTerms={agreedToTerms}
          setAgreedToTerms={(v) => {
            setAgreedToTerms(v);
            if (fieldErrors.terms) setFieldErrors((prev) => ({ ...prev, terms: "" }));
          }}
          fieldErrors={fieldErrors}
          loading={loading}
          error={error}
          otpSent={otpSent}
          otp={otp}
          setOtp={setOtp}
          otpTimeLeft={otpTimeLeft}
          resendCooldown={resendCooldown}
          resendingOtp={resendingOtp}
          onSendOtp={handleSendOtp}
          onVerifyOtpAndRegister={handleVerifyOtpAndRegister}
          onResendOtp={handleResendOtp}
          onBackToEdit={() => {
            setOtpSent(false);
            setOtp("");
            setError("");
          }}
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

            {/* Step 1: Employment Preference (Job Type) */}
            {step === 1 && (
              <EmploymentPreference
                selected={employment}
                onToggle={toggleEmployment}
                onBack={back}
                onNext={handleSaveEmployment}
                loading={stepLoading}
              />
            )}

            {/* Step 2: Upload Resume (Compulsory & Auto-Parsing) */}
            {step === 2 && (
              <ResumeStep
                files={resumeFiles}
                portfolioLink={portfolioLink}
                onPortfolioLink={setPortfolioLink}
                onAddFiles={handleResumeAdded}
                onRemoveFile={removeResumeFile}
                isParsing={isParsingResume}
                parseNotice={resumeParseNotice}
                onBack={back}
                onNext={handleSaveResume}
                loading={stepLoading}
              />
            )}

            {/* Step 3: Skills (Prefilled from resume) */}
            {step === 3 && (
              <SkillsStep
                selected={skills}
                customSkills={customSkills}
                extractedSkills={extractedSkillsList}
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

            {/* Step 4: Work Experience (Prefilled from resume) */}
            {step === 4 && (
              <WorkExperienceStep
                experiences={workExperiences}
                isFresher={isFresher}
                onToggleFresher={(val) => setIsFresher(val)}
                onExperiencesChange={setWorkExperiences}
                onBack={back}
                onNext={handleSaveWorkExperience}
                loading={stepLoading}
              />
            )}

            {/* Step 5: Education (Prefilled from resume) */}
            {step === 5 && (
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

            {/* Step 6: Address & Location (Prefilled from resume) */}
            {step === 6 && (
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

            {/* Step 7: Done / Complete */}
            {step === 7 && (
              <DoneStep
                selectedSkills={skills.length}
                employment={employment[0] || "Flexible"}
                educationAdded={Boolean(institution || selectedDegree)}
                addressCity={city || "Completed"}
                experienceSummary={
                  isFresher
                    ? "Fresher"
                    : workExperiences.length > 0
                    ? `${workExperiences.length} role(s)`
                    : "Experienced"
                }
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
  const { tenant } = useAuth();
  return (
    <header className="flex h-[70px] items-center justify-between border-b border-[#eef0f4] dark:border-slate-800 bg-white dark:bg-[#1a1a1a] px-8 shadow-xs sm:px-14">
      <Link href="/" aria-label="Home" className="flex items-center">
        {tenant?.logoUrl ? (
          <img
            src={tenant.logoUrl}
            alt={tenant.companyName || "Logo"}
            className="h-8 w-auto object-contain max-w-[140px]"
          />
        ) : (
          <Image
            src="/common/logo.png"
            alt={tenant?.companyName || "Logo"}
            width={118}
            height={38}
            className="h-auto w-[118px] object-contain"
            priority
          />
        )}
      </Link>
      <div className="flex items-center gap-3 text-sm text-[#667085] dark:text-slate-400 sm:text-base">
        <span className="hidden sm:inline">Already have an account?</span>
        <Link
          href="/login"
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#2f54eb] px-5 text-xs font-semibold !text-white shadow-sm transition hover:bg-[#2447d8] hover:!text-white"
        >
          <LogIn className="h-4 w-4 text-white" />
          Login
        </Link>
      </div>
    </header>
  );
}

function RegisterBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-80 [background-image:linear-gradient(46deg,transparent_0%,transparent_52%,rgba(47,84,235,0.035)_52.4%,transparent_64%),linear-gradient(132deg,transparent_0%,transparent_58%,rgba(47,84,235,0.03)_58.4%,transparent_70%)]" />
  );
}

function formatTimer(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function OtpInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = useMemo(() => {
    const arr = value.split("").slice(0, 6);
    while (arr.length < 6) arr.push("");
    return arr;
  }, [value]);

  const handleChange = (index: number, char: string) => {
    if (disabled) return;
    const clean = char.replace(/\D/g, "");
    if (!clean) {
      const newDigits = [...digits];
      newDigits[index] = "";
      onChange(newDigits.join(""));
      return;
    }

    const lastChar = clean.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = lastChar;
    const newVal = newDigits.join("");
    onChange(newVal);

    if (index < 5 && lastChar) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      onChange(pasted);
      const nextFocus = Math.min(pasted.length, 5);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  return (
    <div className="flex justify-between gap-2.5 sm:gap-3" onPaste={handlePaste}>
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="h-14 w-12 sm:w-14 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] text-center text-xl font-bold text-slate-900 dark:text-white shadow-xs outline-none transition focus:border-[#2f54eb] focus:ring-2 focus:ring-[#2f54eb]/20 disabled:opacity-50"
        />
      ))}
    </div>
  );
}

function GetStarted({
  onSendOtp,
  onVerifyOtpAndRegister,
  onResendOtp,
  onBackToEdit,
  name = "",
  setName,
  email = "",
  setEmail,
  password = "",
  setPassword,
  contactNumber = "",
  setContactNumber,
  agreedToTerms = false,
  setAgreedToTerms,
  fieldErrors = {},
  loading,
  error,
  otpSent,
  otp,
  setOtp,
  otpTimeLeft,
  resendCooldown,
  resendingOtp,
}: {
  onSendOtp: () => void;
  onVerifyOtpAndRegister: () => void;
  onResendOtp: () => void;
  onBackToEdit: () => void;
  name?: string;
  setName?: (v: string) => void;
  email?: string;
  setEmail?: (v: string) => void;
  password?: string;
  setPassword?: (v: string) => void;
  contactNumber?: string;
  setContactNumber?: (v: string) => void;
  agreedToTerms?: boolean;
  setAgreedToTerms?: (v: boolean) => void;
  fieldErrors?: Record<string, string>;
  loading?: boolean;
  error?: string;
  otpSent: boolean;
  otp: string;
  setOtp: (v: string) => void;
  otpTimeLeft: number;
  resendCooldown: number;
  resendingOtp: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);

  // Live registration setup progress percentage
  const formPercentage = useMemo(() => {
    let pct = 0;
    if (name.trim().length >= 3) pct += 20;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) pct += 20;
    if (password.length >= 6) pct += 20;
    if (/^[+]?[\d\s-]{7,20}$/.test(contactNumber.trim())) pct += 20;
    if (agreedToTerms) pct += 20;
    return pct;
  }, [name, email, password, contactNumber, agreedToTerms]);

  // Password strength meter
  const passwordStrength = useMemo(() => {
    if (!password) return { level: 0, text: "" };
    if (password.length < 6)
      return { level: 1, text: "Too short", color: "bg-rose-500", labelColor: "text-rose-500" };
    const hasNum = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    if (password.length >= 8 && hasNum && hasSpecial) {
      return { level: 3, text: "Strong password", color: "bg-emerald-500", labelColor: "text-emerald-500" };
    }
    if (password.length >= 6 && hasNum) {
      return { level: 2, text: "Good password", color: "bg-amber-500", labelColor: "text-amber-500" };
    }
    return { level: 1, text: "Weak password", color: "bg-rose-500", labelColor: "text-rose-500" };
  }, [password]);

  return (
    <section className="grid min-h-[calc(100vh-70px)] grid-cols-1 lg:grid-cols-2">
      <aside className="flex items-center justify-center bg-[#f8f8f9] dark:bg-slate-900 px-8 py-12 lg:px-14">
        <div className="w-full max-w-[520px]">
          <h1 className="text-center text-3xl font-extrabold text-[#101828] dark:text-white">
            V<span className="text-[#2f54eb]">octrum</span>
          </h1>
          <p className="mt-4 text-center text-sm text-[#98a2b3]">
            Create your account to explore opportunities that match your ambitions
          </p>
          <div className="mx-auto mt-12 max-w-[420px]">
            <h2 className="text-lg font-extrabold uppercase text-[#101828] dark:text-white">How It Works</h2>
            <div className="mt-8 space-y-10">
              <HowItWorksItem
                number="1"
                title="Verify Email & Select Job Preference"
                copy="Verify your email with OTP, then choose your preferred employment type"
              />
              <HowItWorksItem
                number="2"
                title="Upload Resume for Auto-Prefill"
                copy="Our AI parses your resume and automatically populates skills and experience"
              />
              <HowItWorksItem
                number="3"
                title="Get Matched & Hired"
                copy="Review your prefilled details and explore matching career opportunities"
              />
            </div>
          </div>
          <p className="mt-20 text-center text-sm font-medium italic text-[#2f54eb]">
            &quot; Takes less than 2 minutes to get started &quot;
          </p>
        </div>
      </aside>

      <section className="flex items-center justify-center px-8 py-12 lg:px-14">
        <div className="w-full max-w-[520px]">
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 p-3.5 text-xs text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-medium">
              <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {otpSent ? (
            /* =========================================================================
               OTP VERIFICATION VIEW
               ========================================================================= */
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] p-8 shadow-sm">
              <button
                type="button"
                onClick={onBackToEdit}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2f54eb] hover:underline mb-4"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Edit Details
              </button>

              <div className="text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 dark:bg-slate-800 text-[#2f54eb] mb-3">
                  <Mail className="h-6 w-6" />
                </span>
                <h2 className="text-2xl font-extrabold text-[#101828] dark:text-white">
                  Verify Your Email
                </h2>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  We have sent a 6-digit verification code to
                </p>
                <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">
                  {email}
                </p>
              </div>

              <div className="mt-8">
                <OtpInput value={otp} onChange={setOtp} disabled={loading} />
              </div>

              <div className="mt-6 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>
                  Code expires in:{" "}
                  <strong className={otpTimeLeft > 0 ? "text-slate-800 dark:text-slate-200 font-bold" : "text-rose-500 font-bold"}>
                    {formatTimer(otpTimeLeft)}
                  </strong>
                </span>

                <button
                  type="button"
                  onClick={onResendOtp}
                  disabled={resendCooldown > 0 || resendingOtp || loading}
                  className="inline-flex items-center gap-1 font-bold text-[#2f54eb] disabled:opacity-50 disabled:cursor-not-allowed hover:underline"
                >
                  {resendingOtp ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" /> Sending...
                    </>
                  ) : resendCooldown > 0 ? (
                    `Resend in ${resendCooldown}s`
                  ) : (
                    <>
                      <RotateCw className="h-3 w-3" /> Resend Code
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={onVerifyOtpAndRegister}
                disabled={loading || otp.length < 6}
                className="mt-8 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#2f54eb] text-sm sm:text-base font-bold text-white transition hover:bg-[#2447d8] disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Verifying Code &amp; Creating Account...
                  </>
                ) : (
                  "Verify & Continue"
                )}
              </button>
            </div>
          ) : (
            /* =========================================================================
               INITIAL REGISTER FORM VIEW
               ========================================================================= */
            <form
              onSubmit={(event) => {
                event.preventDefault();
                onSendOtp();
              }}
            >
              <div className="mb-6 text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101828] dark:text-white">Get Started</h2>
                <p className="mt-2 text-sm text-[#98a2b3]">Register to start exploring jobs and build your career</p>
              </div>

              {/* Registration Progress Indicator */}
              <div className="mb-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#f8faff] dark:bg-slate-900/60 p-3.5 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Registration Progress</span>
                  <span className={formPercentage === 100 ? "text-emerald-600 dark:text-emerald-400" : "text-[#2f54eb]"}>
                    {formPercentage}% Complete
                  </span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      formPercentage === 100 ? "bg-emerald-500" : "bg-[#2f54eb]"
                    }`}
                    style={{ width: `${formPercentage}%` }}
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="mt-4">
                <LineInput
                  icon={<User className="h-5 w-5" />}
                  placeholder="Full Name *"
                  value={name}
                  onChange={(e) => setName?.(e.target.value)}
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-rose-500 font-medium pl-1">{fieldErrors.name}</p>
                )}
              </div>

              {/* Email Address */}
              <div className="mt-4">
                <LineInput
                  icon={<Mail className="h-5 w-5" />}
                  placeholder="Email Address *"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail?.(e.target.value)}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-rose-500 font-medium pl-1">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="mt-4">
                <LineInput
                  icon={<Lock className="h-5 w-5" />}
                  placeholder="Password (min 6 characters) *"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword?.(e.target.value)}
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-rose-500 font-medium pl-1">{fieldErrors.password}</p>
                )}
                {password && (
                  <div className="mt-1.5 flex items-center justify-between text-[11px] px-1">
                    <div className="flex gap-1.5 flex-1 max-w-[120px]">
                      <span
                        className={`h-1 flex-1 rounded-full ${
                          passwordStrength.level >= 1 ? passwordStrength.color : "bg-slate-200"
                        }`}
                      />
                      <span
                        className={`h-1 flex-1 rounded-full ${
                          passwordStrength.level >= 2 ? passwordStrength.color : "bg-slate-200"
                        }`}
                      />
                      <span
                        className={`h-1 flex-1 rounded-full ${
                          passwordStrength.level >= 3 ? passwordStrength.color : "bg-slate-200"
                        }`}
                      />
                    </div>
                    <span className={`font-semibold ${passwordStrength.labelColor}`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                )}
              </div>

              {/* Contact Number */}
              <div className="mt-4">
                <LineInput
                  icon={<User className="h-5 w-5" />}
                  placeholder="Contact Number (e.g. +1 555-0199 or 9876543210) *"
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber?.(e.target.value)}
                />
                {fieldErrors.contactNumber && (
                  <p className="mt-1 text-xs text-rose-500 font-medium pl-1">{fieldErrors.contactNumber}</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="mt-6">
                <label className="flex items-center gap-3 text-xs sm:text-sm text-[#475467] dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms?.(e.target.checked)}
                    className="h-4 w-4 rounded border-[#d0d5dd] accent-[#2f54eb]"
                  />
                  <span>I agree to the Terms &amp; Privacy Policy</span>
                </label>
                {fieldErrors.terms && (
                  <p className="mt-1 text-xs text-rose-500 font-medium pl-1">{fieldErrors.terms}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#2f54eb] text-base sm:text-lg font-bold text-white transition hover:bg-[#2447d8] disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Sending Verification Code...
                  </>
                ) : (
                  "Verify Email & Continue"
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </section>
  );
}

function HowItWorksItem({ number, title, copy }: { number: string; title: string; copy: string }) {
  return (
    <div className="relative flex gap-6">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#2f54eb] text-sm font-bold text-white">
        {number}
      </span>
      <span>
        <span className="block text-base font-bold text-[#667085] dark:text-slate-300">{title}</span>
        <span className="mt-1 block max-w-[360px] text-sm leading-6 text-[#98a2b3]">{copy}</span>
      </span>
    </div>
  );
}

type StepProps = { onBack: () => void; onNext: () => void; loading?: boolean };

/**
 * STEP 1: Employment Preference (Job Type)
 */
function EmploymentPreference({
  selected,
  onToggle,
  onBack,
  onNext,
  loading,
}: StepProps & { selected: string[]; onToggle: (value: string) => void }) {
  return (
    <>
      <StepHeading
        title="1. Employment Preference"
        copy="What type of work fits your lifestyle best? Select at least one option."
        step={1}
        percent={16}
        filled={1}
      />
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {employmentOptions.map((option) => {
          const Icon = option.icon;
          const checked = selected.includes(option.title);
          return (
            <label
              key={option.title}
              className={`flex h-[82px] cursor-pointer items-center justify-between rounded-xl border px-5 text-left shadow-xs transition ${
                checked
                  ? "border-[#2f54eb] bg-blue-50/50 dark:bg-blue-950/20 ring-1 ring-[#2f54eb]"
                  : "border-[#dfe3ea] dark:border-slate-700 bg-white dark:bg-[#1a1a1a] hover:border-[#2f54eb]"
              }`}
            >
              <span className="flex items-center gap-4">
                <span
                  className={`grid h-11 w-11 place-items-center rounded-xl transition ${
                    checked
                      ? "bg-[#2f54eb] text-white"
                      : "bg-[#e9edff] dark:bg-slate-800 text-[#2f54eb]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-base font-semibold text-[#101828] dark:text-white">
                    {option.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-[#98a2b3]">{option.copy}</span>
                </span>
              </span>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(option.title)}
                className="h-5 w-5 rounded border-[#98a2b3] accent-[#2f54eb]"
              />
            </label>
          );
        })}
      </div>
      <StepActions onBack={onBack} onNext={onNext} loading={loading} />
    </>
  );
}

/**
 * STEP 2: Resume Upload (Compulsory + Auto-Parser)
 */
function ResumeStep({
  files,
  portfolioLink,
  onPortfolioLink,
  onAddFiles,
  onRemoveFile,
  isParsing,
  parseNotice,
  onBack,
  onNext,
  loading,
}: StepProps & {
  files: UploadFile[];
  portfolioLink: string;
  onPortfolioLink: (value: string) => void;
  onAddFiles: (files: FileList | null) => void;
  onRemoveFile: (id: string) => void;
  isParsing?: boolean;
  parseNotice?: string | null;
}) {
  return (
    <>
      <StepHeading
        title="2. Upload Resume"
        copy="Upload your resume to automatically prefill your skills, education, and experience"
        step={2}
        percent={33}
        filled={2}
      />

      <div className="mx-auto mt-8 w-full max-w-[560px] rounded-2xl bg-white dark:bg-[#1a1a1a] p-6 text-center shadow-md border border-slate-200 dark:border-slate-800">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 px-3.5 py-1 text-xs font-bold text-red-600 dark:text-red-400">
          <span>* Resume is Compulsory</span>
        </div>

        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#e9edff] dark:bg-slate-800 text-[#2f54eb]">
          <Upload className="h-6 w-6" />
        </span>

        <h3 className="mt-4 text-lg font-bold text-[#101828] dark:text-white">
          Upload Your Resume <span className="text-red-500">*</span>
        </h3>
        <p className="mt-1 text-xs text-[#98a2b3]">
          Supports PDF, DOC, DOCX, TXT up to 10 MB. We automatically extract and prefill your details.
        </p>

        <FilePicker id="resume-file" label="Browse Files" onChange={onAddFiles} />

        <FileList files={files} onRemove={onRemoveFile} />

        {isParsing && (
          <div className="mt-5 flex items-center justify-center gap-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 p-3.5 text-xs font-semibold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
            <span>Analyzing resume and extracting skills, experience & education...</span>
          </div>
        )}

        {parseNotice && !isParsing && (
          <div className="mt-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-4 text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Resume Parsed Successfully</span>
            </div>
            <p className="mt-1 text-xs text-slate-700 dark:text-slate-300">{parseNotice}</p>
            <p className="mt-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
              Next: You will review your prefilled skills and experience.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 max-w-[560px] mx-auto">
        <Field
          label="Portfolio / LinkedIn URL (Optional)"
          placeholder="https://linkedin.com/in/username"
          value={portfolioLink}
          onChange={onPortfolioLink}
          icon={<LinkIcon className="h-5 w-5 text-[#2f54eb]" />}
        />
      </div>

      <StepActions onBack={onBack} onNext={onNext} loading={loading} />
    </>
  );
}

/**
 * STEP 3: Skills Step (Prefilled from resume)
 */
function SkillsStep({
  selected,
  customSkills,
  extractedSkills,
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
  extractedSkills?: string[];
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
    const withCustom = customSkills.length
      ? [...initialSkillGroups, { title: "Custom & Extracted Skills", skills: customSkills }]
      : initialSkillGroups;
    if (!query) return withCustom;
    return withCustom
      .map((group) => ({
        ...group,
        skills: group.skills.filter((skill) => skill.toLowerCase().includes(query)),
      }))
      .filter((group) => group.skills.length > 0);
  }, [customSkills, search]);

  const extractedSet = useMemo(() => new Set((extractedSkills || []).map((s) => s.toLowerCase())), [extractedSkills]);

  return (
    <>
      <StepHeading
        title="3. Your Skills"
        copy="Review skills prefilled from your resume or add more to represent your expertise"
        step={3}
        percent={50}
        filled={3}
      />

      {extractedSkills && extractedSkills.length > 0 && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 p-3 text-xs text-blue-800 dark:text-blue-300">
          <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
          <span>
            <strong>{extractedSkills.length} skills</strong> detected and selected from your resume. Tap any skill to toggle.
          </span>
        </div>
      )}

      <SearchBox placeholder="Search Skill..." value={search} onChange={onSearch} />

      <div className="mt-7 space-y-6">
        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-4 text-base font-semibold text-[#475467] dark:text-slate-300">
              {group.title}
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {group.skills.map((skill) => {
                const isExtracted = extractedSet.has(skill.toLowerCase());
                return (
                  <Pill
                    key={skill}
                    label={skill}
                    isExtracted={isExtracted}
                    selected={selected.includes(skill)}
                    onClick={() => onToggle(skill)}
                  />
                );
              })}
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
          <button
            type="button"
            onClick={onAddCustomSkill}
            className="h-11 rounded-lg bg-[#2f54eb] px-5 text-sm font-bold text-white transition hover:bg-[#2447d8]"
          >
            Add
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onShowCustomSkill}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#475467] dark:text-slate-300 hover:text-[#2f54eb]"
        >
          <Plus className="h-4 w-4 text-[#2f54eb]" />
          Add Custom Skills
        </button>
      )}

      <div className="mt-4 text-xs font-semibold text-slate-500">
        Selected: <span className="text-[#2f54eb] font-bold">{selected.length}</span> skill(s)
      </div>

      <StepActions onBack={onBack} onNext={onNext} loading={loading} />
    </>
  );
}

/**
 * STEP 4: Work Experience Step (Prefilled from resume)
 */
function WorkExperienceStep({
  experiences,
  isFresher,
  onToggleFresher,
  onExperiencesChange,
  onBack,
  onNext,
  loading,
}: StepProps & {
  experiences: ParsedResumeExperience[];
  isFresher: boolean;
  onToggleFresher: (val: boolean) => void;
  onExperiencesChange: (experiences: ParsedResumeExperience[]) => void;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Form states
  const [designation, setDesignation] = useState("");
  const [organization, setOrganization] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setDesignation("");
    setOrganization("");
    setLocation("");
    setStartDate("");
    setEndDate("");
    setIsCurrent(false);
    setDescription("");
    setFormError("");
    setShowAddForm(true);
  };

  const handleOpenEdit = (index: number) => {
    const item = experiences[index];
    setEditingIndex(index);
    setDesignation(item.designation || "");
    setOrganization(item.organization || "");
    setLocation(item.location || "");
    setStartDate(item.startDate ? item.startDate.slice(0, 10) : "");
    setEndDate(item.endDate ? item.endDate.slice(0, 10) : "");
    setIsCurrent(Boolean(item.currentRole));
    setDescription(item.description || "");
    setFormError("");
    setShowAddForm(true);
  };

  const handleSaveExperienceItem = () => {
    if (!designation.trim()) {
      setFormError("Job title / Designation is required.");
      return;
    }
    if (!organization.trim()) {
      setFormError("Company / Organization name is required.");
      return;
    }

    const newItem: ParsedResumeExperience = {
      id: editingIndex !== null ? experiences[editingIndex]?.id : undefined,
      designation: designation.trim(),
      organization: organization.trim(),
      location: location.trim() || undefined,
      startDate: startDate || undefined,
      endDate: isCurrent ? undefined : endDate || undefined,
      currentRole: isCurrent,
      description: description.trim() || undefined,
    };

    if (editingIndex !== null) {
      const updated = [...experiences];
      updated[editingIndex] = newItem;
      onExperiencesChange(updated);
    } else {
      onExperiencesChange([...experiences, newItem]);
    }

    setShowAddForm(false);
  };

  const handleDeleteExperience = (index: number) => {
    const updated = experiences.filter((_, i) => i !== index);
    onExperiencesChange(updated);
  };

  return (
    <>
      <StepHeading
        title="4. Work Experience"
        copy="Review your prefilled experience or let us know if you are a fresher"
        step={4}
        percent={66}
        filled={4}
      />

      {/* Fresher Toggle */}
      <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] p-4.5 shadow-2xs">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isFresher}
            onChange={(e) => {
              onToggleFresher(e.target.checked);
              if (e.target.checked) setShowAddForm(false);
            }}
            className="h-5 w-5 rounded border-[#d0d5dd] accent-[#2f54eb]"
          />
          <div>
            <span className="block text-sm font-bold text-slate-900 dark:text-white">
              I am a fresher / I do not have prior work experience
            </span>
            <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select this if you are a student or fresh graduate seeking entry-level roles.
            </span>
          </div>
        </label>
      </div>

      {!isFresher && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Work Experience ({experiences.length})
            </h3>
            {!showAddForm && (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 px-3.5 py-1.5 text-xs font-bold text-[#2f54eb] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Experience
              </button>
            )}
          </div>

          {/* List of existing experiences */}
          {experiences.length === 0 && !showAddForm && (
            <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
              <Briefcase className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                No work experience detected from resume
              </p>
              <p className="mt-1 text-xs text-slate-500">
                You can add your past roles or select &ldquo;I am a fresher&rdquo; above.
              </p>
              <button
                type="button"
                onClick={handleOpenAdd}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#2f54eb] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#2447d8]"
              >
                <Plus className="h-4 w-4" /> Add Experience
              </button>
            </div>
          )}

          {experiences.map((exp, index) => (
            <div
              key={index}
              className="group relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] p-5 shadow-2xs hover:border-[#2f54eb] transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 dark:bg-slate-800 text-[#2f54eb]">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {exp.designation}
                    </h4>
                    <p className="text-xs font-semibold text-[#2f54eb] dark:text-blue-400">
                      {exp.organization}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {exp.startDate ? exp.startDate.slice(0, 7) : "Past"} -{" "}
                        {exp.currentRole ? "Present" : exp.endDate ? exp.endDate.slice(0, 7) : "Completed"}
                      </span>
                      {exp.location && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {exp.location}
                          </span>
                        </>
                      )}
                    </div>
                    {exp.description && (
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(index)}
                    aria-label="Edit role"
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteExperience(index)}
                    aria-label="Delete role"
                    className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add / Edit Experience Form */}
          {showAddForm && (
            <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-white dark:bg-[#1a1a1a] p-5 shadow-md">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                {editingIndex !== null ? "Edit Work Experience" : "Add Work Experience"}
              </h4>

              {formError && (
                <div className="mb-4 text-xs font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-lg border border-rose-200">
                  {formError}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Job Title / Designation *"
                  placeholder="e.g. Frontend Developer"
                  value={designation}
                  onChange={setDesignation}
                />
                <Field
                  label="Company / Organization *"
                  placeholder="e.g. Acme Technologies"
                  value={organization}
                  onChange={setOrganization}
                />
                <Field
                  label="Location"
                  placeholder="e.g. Remote or Bangalore"
                  value={location}
                  onChange={setLocation}
                />
                <div className="sm:col-span-1">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Start Date
                    </span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] px-3.5 text-sm outline-none focus:border-[#2f54eb]"
                    />
                  </label>
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCurrent}
                      onChange={(e) => setIsCurrent(e.target.checked)}
                      className="h-4 w-4 rounded accent-[#2f54eb]"
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      I currently work in this role
                    </span>
                  </label>
                  {!isCurrent && (
                    <div>
                      <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        End Date
                      </span>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="h-11 w-full max-w-[280px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] px-3.5 text-sm outline-none focus:border-[#2f54eb]"
                      />
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Description / Responsibilities
                  </span>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe your key responsibilities and accomplishments..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] p-3 text-sm outline-none focus:border-[#2f54eb] placeholder:text-[#98a2b3]"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveExperienceItem}
                  className="rounded-lg bg-[#2f54eb] px-5 py-2 text-xs font-bold text-white hover:bg-[#2447d8]"
                >
                  Save Experience
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <StepActions onBack={onBack} onNext={onNext} loading={loading} />
    </>
  );
}

/**
 * STEP 5: Education Step (Prefilled from resume)
 */
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
  const filteredDegrees = degreeOptions.filter((degree) =>
    degree.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <>
      <StepHeading
        title="5. Add Education"
        copy="Review academic background prefilled from your resume or update details"
        step={5}
        percent={83}
        filled={5}
      />
      <SearchBox placeholder="Search Degree..." value={search} onChange={onSearch} />
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-[#475467] dark:text-slate-300">
          Degree / Qualification
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {filteredDegrees.map((degree) => (
            <Pill
              key={degree}
              label={degree}
              selected={selectedDegree.toLowerCase() === degree.toLowerCase()}
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
            value={startYear ? startYear.slice(0, 10) : ""}
            onChange={onStartYearChange}
          />
          <Field
            label="End Date / Passing"
            type="date"
            placeholder="Select end date"
            value={endYear ? endYear.slice(0, 10) : ""}
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

/**
 * STEP 6: Address & Location Step (Prefilled from resume)
 */
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
      <StepHeading
        title="6. Address & Location"
        copy="Where are you currently located? Verified locations help match nearby or remote jobs."
        step={6}
        percent={95}
        filled={6}
      />
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

/**
 * STEP 7: Done / Complete
 */
function DoneStep({
  selectedSkills,
  employment,
  educationAdded,
  addressCity,
  experienceSummary,
  onBack,
}: {
  selectedSkills: number;
  employment: string;
  educationAdded: boolean;
  addressCity: string;
  experienceSummary: string;
  onBack: () => void;
}) {
  const redirectUrl =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("redirect")
      : null;
  const targetDestination = redirectUrl || "/dashboard";

  return (
    <>
      <StepHeading
        title="All Done!"
        copy="Your candidate profile is fully configured, verified, and active"
        percent={100}
        filled={6}
        completeOnly
      />
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-white dark:bg-[#1a1a1a] px-8 py-9 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Check className="h-7 w-7 stroke-[3]" />
          </span>
          <h3 className="mt-5 text-lg font-bold text-[#2f54eb]">Profile Status</h3>
          <p className="mt-1 text-xl font-extrabold text-[#101828] dark:text-white">
            Profile Synced &amp; Active
          </p>
          <p className="mx-auto mt-2 max-w-[300px] text-xs leading-5 text-[#98a2b3]">
            Your verified email, resume, skills, and experience are saved. You are ready to explore and apply.
          </p>
        </div>

        <div className="flex items-center gap-6 rounded-xl bg-white dark:bg-[#1a1a1a] px-8 py-9 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full border-[8px] border-[#16a34a] text-center">
            <span className="text-xs text-[#667085] dark:text-slate-400">
              <strong className="block text-base text-[#101828] dark:text-white">100%</strong> Complete
            </span>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#101828] dark:text-white">
              Ready for Applications
            </h3>
            <p className="mt-1 max-w-[250px] text-xs leading-5 text-[#667085] dark:text-slate-400">
              Recruiters can now view your verified profile, skills, experience, and education details.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        <SummaryCard value={`${selectedSkills}`} label="Skills Added" />
        <SummaryCard value={experienceSummary} label="Experience" />
        <SummaryCard value={educationAdded ? "Verified" : "Pending"} label="Education" />
        <SummaryCard value={addressCity} label="Location" />
      </div>

      <div className="mt-10 flex justify-end gap-4">
        <button
          type="button"
          onClick={onBack}
          className="h-11 w-32 rounded-lg border border-[#2f54eb] bg-white dark:bg-[#1a1a1a] text-sm font-bold text-[#2f54eb] transition hover:bg-[#eef3ff]"
        >
          Back
        </button>
        <Link
          href={targetDestination}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-[#2f54eb] px-8 text-sm font-bold !text-white transition hover:bg-[#2447d8] hover:!text-white shadow-md"
        >
          {redirectUrl ? "Continue To Job / Resume" : "Explore Dashboard & Jobs"}
        </Link>
      </div>
    </>
  );
}

function StepHeading({
  title,
  copy,
  step,
  percent,
  filled,
  completeOnly,
}: {
  title: string;
  copy: string;
  step?: number;
  percent: number;
  filled: number;
  completeOnly?: boolean;
}) {
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#101828] dark:text-white">{title}</h1>
      <p className="mt-1 text-sm text-[#98a2b3]">{copy}</p>
      <div className="mt-6 flex items-center justify-between gap-6">
        <div className="flex flex-1 gap-2.5">
          {Array.from({ length: 6 }).map((_, index) => (
            <span
              key={index}
              className={`h-2 flex-1 rounded-full transition-all ${
                index < filled || completeOnly
                  ? "bg-[#2f54eb]"
                  : "bg-slate-200 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>
        <span className="min-w-[170px] text-right text-xs font-bold text-[#101828] dark:text-white">
          {step ? <span className="font-semibold text-[#2f54eb]">Step {step} of 6</span> : null}
          {step ? " · " : null}
          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{percent}%</span> Complete
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

function LineInput({
  icon,
  placeholder,
  type = "text",
  trailing,
  value,
  onChange,
}: {
  icon: ReactNode;
  placeholder: string;
  type?: string;
  trailing?: ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="mt-6 flex h-11 items-center gap-3 border-b border-[#dfe3ea] dark:border-slate-700 text-[#2f54eb]">
      {icon}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="min-w-0 flex-1 bg-transparent text-sm text-[#101828] dark:text-white outline-none placeholder:text-[#98a2b3]"
      />
      {trailing}
    </label>
  );
}

function SearchBox({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="mt-6 flex h-11 max-w-[560px] items-center gap-3 rounded-lg border border-[#d0d5dd] dark:border-slate-700 bg-white dark:bg-[#1a1a1a] px-4 text-[#2f54eb]">
      <Search className="h-4 w-4 text-slate-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#667085] dark:text-slate-400"
      />
    </label>
  );
}

function Pill({
  label,
  selected,
  isExtracted,
  onClick,
}: {
  label: string;
  selected?: boolean;
  isExtracted?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex items-center gap-1.5 h-8 rounded-full border px-4 text-xs font-semibold transition ${
        selected
          ? "border-[#2f54eb] bg-[#2f54eb] text-white"
          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] text-slate-700 dark:text-slate-300 hover:border-[#2f54eb] hover:text-[#2f54eb]"
      }`}
    >
      {isExtracted && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            selected ? "bg-emerald-300" : "bg-emerald-500"
          }`}
          title="Extracted from resume"
        />
      )}
      <span>{label}</span>
    </button>
  );
}

function Field({
  label,
  placeholder,
  icon,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  icon?: ReactNode;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</span>
      <span className="flex h-11 items-center gap-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] px-3.5 focus-within:border-[#2f54eb]">
        {icon}
        <input
          type={type}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder:text-[#98a2b3]"
        />
      </span>
    </label>
  );
}

function FilePicker({
  id,
  label,
  icon,
  onChange,
}: {
  id: string;
  label: string;
  icon?: ReactNode;
  onChange: (files: FileList | null) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="mx-auto mt-4 inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-[#2f54eb] px-5 text-xs font-bold text-white transition hover:bg-[#2447d8]"
    >
      {icon}
      {label}
      <input
        id={id}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.rtf"
        className="sr-only"
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.files)}
      />
    </label>
  );
}

function FileList({ files, onRemove }: { files: UploadFile[]; onRemove: (id: string) => void }) {
  if (!files.length) return null;
  return (
    <div className="mt-4 space-y-2.5">
      {files.map((file) => (
        <UploadRow key={file.id} file={file} onRemove={() => onRemove(file.id)} />
      ))}
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
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remove ${file.name}`}
              className="text-red-500 transition hover:text-red-600"
            >
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
