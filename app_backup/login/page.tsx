"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BriefcaseBusiness,
  Building2,
  Check,
  EyeOff,
  Lock,
  LogIn,
  Mail,
  MessageCircle,
  Star,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useRef, useState } from "react";

type AuthStep = "login" | "forgot" | "otp" | "reset" | "success";

const loginStats = [
  { label: "Active Jobs", value: "5K+", icon: BriefcaseBusiness },
  { label: "Companies", value: "10K+", icon: Building2 },
  { label: "Match Rate", value: "95%", icon: TrendingUp },
  { label: "User Rating", value: "4.8", icon: UserRound, suffix: <Star className="h-3 w-3 fill-[#101828]" /> },
];

const bullets = [
  "Discover opportunities that truly match your skills",
  "Explore roles shared by companies actively hiring",
  "Apply with ease without complicated steps",
  "Keep your career moving forward, one opportunity time",
];

const stepContent = {
  forgot: {
    title: "Secure Your Account",
    copy: "No worries--we'll help you get back into your account by resetting your password quickly and safely",
    image: "/login/46754d9b214c75f31ba90b6c2dd11555d16911b4.png",
    alt: "Security account illustration",
  },
  otp: {
    title: "Verify Your Identity",
    copy: "We've sent a code to your email to confirm it's really you and keep your account secure",
    image: "/login/19d3535e77f78549be94a42527cd69f35a493cd2.png",
    alt: "OTP verification illustration",
  },
  reset: {
    title: "You're Almost Done",
    copy: "Create a new password to protect your account and regain access--make sure it's strong and secure",
    image: "/login/a9fcdeb8b8c30eed42af9c706da5e4ad4fc80fe6.png",
    alt: "Reset password illustration",
  },
};

export default function LoginPage() {
  const [step, setStep] = useState<AuthStep>("login");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const setOtpDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    if (digit && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const onOtpKeyDown = (index: number, key: string) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const goLogin = () => {
    setStep("login");
    setOtp(["", "", "", ""]);
  };

  const isLogin = step === "login";
  const side = step === "forgot" || step === "otp" || step === "reset" ? stepContent[step] : null;

  return (
    <main className="min-h-screen bg-white text-[#101828]">
      <header className="flex h-[70px] items-center justify-between border-b border-[#eef0f4] bg-white px-8 shadow-[0_2px_10px_rgba(16,24,40,0.08)] sm:px-12">
        <Link href="/" aria-label="Voctrum home" className="flex items-center">
          <Image src="/common/logo.png" alt="Voctrum" width={96} height={30} className="h-auto w-24 object-contain" priority />
        </Link>

        {step === "success" ? (
          <a href="mailto:support@voctrum.com" className="flex items-center gap-2 text-sm text-[#667085]">
            <MessageCircle className="h-4 w-4 text-[#2f54eb]" />
            Need help? Contact support
          </a>
        ) : isLogin ? (
          <Link href="/register" className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#2f54eb] px-5 text-xs font-semibold !text-white shadow-sm transition hover:bg-[#2447d8] hover:!text-white">
            <LogIn className="h-4 w-4" />
            Register
          </Link>
        ) : (
          <div className="flex items-center gap-3 text-sm text-[#667085]">
            <span className="hidden sm:inline">If you recall your password</span>
            <button onClick={goLogin} className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#2f54eb] px-5 text-xs font-semibold text-white shadow-sm">
              <LogIn className="h-4 w-4" />
              Back to Login
            </button>
          </div>
        )}
      </header>

      {step === "success" ? (
        <SuccessPanel onBack={goLogin} />
      ) : (
        <section className="grid min-h-[calc(100vh-70px)] grid-cols-1 lg:grid-cols-2">
          <aside className="flex items-center justify-center bg-[#f8f8f9] px-8 py-12 lg:px-12">
            {isLogin ? <LoginIntro /> : side ? <IllustrationPanel {...side} /> : null}
          </aside>

          <section className="flex items-center justify-center px-8 py-12 lg:px-12">
            {step === "login" && <LoginForm onForgot={() => setStep("forgot")} />}
            {step === "forgot" && <ForgotForm onSendOtp={() => setStep("otp")} />}
            {step === "otp" && (
              <OtpForm
                otp={otp}
                refs={otpRefs}
                onChange={setOtpDigit}
                onKeyDown={onOtpKeyDown}
                onSubmit={() => setStep("reset")}
              />
            )}
            {step === "reset" && <ResetForm onReset={() => setStep("success")} />}
          </section>
        </section>
      )}
    </main>
  );
}

function LoginIntro() {
  return (
    <div className="w-full max-w-[440px] text-center">
      <h1 className="text-3xl font-extrabold tracking-normal text-[#101828]">
        V<span className="text-[#2f54eb]">octrum</span>
      </h1>
      <p className="mt-3 text-sm text-[#98a2b3]">Continue explore opportunities and managing your journey with us</p>

      <div className="mx-auto mt-8 grid max-w-[330px] grid-cols-2 gap-6">
        {loginStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex h-[78px] items-center justify-between rounded-lg bg-[#edf5ff] px-4 text-left">
              <span className="block border-l-4 border-[#2f54eb] pl-3">
                <span className="block text-xs text-[#667085]">{stat.label}</span>
                <span className="mt-1 flex items-center gap-1 text-sm font-extrabold text-[#101828]">
                  {stat.value}
                  {stat.suffix}
                </span>
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#cfddff] text-[#2f54eb]">
                <Icon className="h-4 w-4" />
              </span>
            </div>
          );
        })}
      </div>

      <ul className="mx-auto mt-8 max-w-[360px] space-y-4 text-left text-sm text-[#667085]">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#667085]" />
            {bullet}
          </li>
        ))}
      </ul>

      <p className="mt-28 text-sm font-medium italic text-[#2f54eb]">&quot;Trusted by professionals advancing their careers every day&quot;</p>
    </div>
  );
}

function IllustrationPanel({ title, copy, image, alt }: { title: string; copy: string; image: string; alt: string }) {
  return (
    <div className="w-full max-w-[460px] text-center">
      <h1 className="text-3xl font-extrabold text-[#101828]">{title}</h1>
      <p className="mx-auto mt-3 max-w-[360px] text-sm leading-5 text-[#98a2b3]">{copy}</p>
      <div className="relative mx-auto mt-8 h-[330px] w-full max-w-[420px]">
        <Image src={image} alt={alt} fill sizes="420px" className="object-contain" priority />
      </div>
    </div>
  );
}

function LoginForm({ onForgot }: { onForgot: () => void }) {
  return (
    <form className="w-full max-w-[430px]" onSubmit={(event) => event.preventDefault()}>
      <FormHeading title="Welcome back!" copy="Log in to continue your journey with Voctrum" />
      <IconInput icon={<Mail className="h-5 w-5" />} placeholder="Email" type="email" />
      <IconInput icon={<Lock className="h-5 w-5" />} placeholder="Password" type="password" trailing={<EyeOff className="h-5 w-5" />} />

      <div className="mt-5 flex items-center justify-between text-xs text-[#667085]">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="h-4 w-4 rounded border-[#d0d5dd]" />
          Remember me
        </label>
        <button type="button" onClick={onForgot} className="font-medium text-[#98a2b3] hover:text-[#2f54eb]">
          Forgot Password?
        </button>
      </div>

      <PrimaryButton label="Log In" />

      <div className="my-8 flex items-center gap-4 text-xs text-[#98a2b3]">
        <span className="h-px flex-1 bg-[#e4e7ec]" />
        Or continue with
        <span className="h-px flex-1 bg-[#e4e7ec]" />
      </div>

      <div className="flex justify-center gap-6">
        <SocialButton label="Google" icon={<FcGoogle className="h-8 w-8" />} />
        <SocialButton label="Facebook" icon={<FaFacebookF className="h-7 w-7 text-[#2f54eb]" />} />
      </div>
    </form>
  );
}

function ForgotForm({ onSendOtp }: { onSendOtp: () => void }) {
  return (
    <form className="w-full max-w-[430px]" onSubmit={(event) => event.preventDefault()}>
      <FormHeading title="Forgot Password" copy="Enter your email and we'll send you an otp to reset your password" />
      <IconInput icon={<Mail className="h-5 w-5" />} placeholder="Email" type="email" />
      <PrimaryButton label="Send OTP" onClick={onSendOtp} />
    </form>
  );
}

function OtpForm({
  otp,
  refs,
  onChange,
  onKeyDown,
  onSubmit,
}: {
  otp: string[];
  refs: React.MutableRefObject<Array<HTMLInputElement | null>>;
  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, key: string) => void;
  onSubmit: () => void;
}) {
  return (
    <form className="w-full max-w-[430px]" onSubmit={(event) => event.preventDefault()}>
      <FormHeading title="Enter OTP" copy="One step away, enter the 4-digit code sent to h******@gmail.com" />
      <div className="mt-8 flex justify-center gap-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(node) => {
              refs.current[index] = node;
            }}
            value={digit}
            onChange={(event) => onChange(index, event.target.value)}
            onKeyDown={(event) => onKeyDown(index, event.key)}
            inputMode="numeric"
            aria-label={`OTP digit ${index + 1}`}
            className="h-16 w-16 rounded-lg border border-transparent bg-[#e9e9e9] text-center text-2xl font-bold outline-none transition focus:border-[#2f54eb] focus:bg-white"
            maxLength={1}
          />
        ))}
      </div>
      <PrimaryButton label="Submit" onClick={onSubmit} />
      <p className="mt-7 text-center text-xs text-[#98a2b3]">
        Didn&apos;t recieve the code ?{" "}
        <button type="button" className="font-bold text-[#101828]">
          Send Again
        </button>
      </p>
    </form>
  );
}

function ResetForm({ onReset }: { onReset: () => void }) {
  return (
    <form className="w-full max-w-[430px]" onSubmit={(event) => event.preventDefault()}>
      <FormHeading title="Reset Password" copy="Hey! create a new strong password at least 8 characters long to secure your account" />
      <IconInput icon={<Lock className="h-5 w-5" />} placeholder="Password" type="password" trailing={<EyeOff className="h-5 w-5" />} />
      <IconInput icon={<Lock className="h-5 w-5" />} placeholder="Confirm Password" type="password" trailing={<EyeOff className="h-5 w-5" />} />
      <label className="mt-5 flex items-center gap-2 text-xs text-[#101828]">
        <input type="checkbox" className="h-4 w-4 rounded border-[#d0d5dd]" />
        Required all devices to login with new password
      </label>
      <PrimaryButton label="Reset Password" onClick={onReset} />
    </form>
  );
}

function SuccessPanel({ onBack }: { onBack: () => void }) {
  return (
    <section className="relative grid min-h-[calc(100vh-70px)] place-items-center overflow-hidden bg-[#fbfbfc] px-6">
      <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(30deg,rgba(47,84,235,0.035)_12%,transparent_12.5%,transparent_87%,rgba(47,84,235,0.035)_87.5%,rgba(47,84,235,0.035)),linear-gradient(150deg,rgba(47,84,235,0.035)_12%,transparent_12.5%,transparent_87%,rgba(47,84,235,0.035)_87.5%,rgba(47,84,235,0.035))] [background-size:220px_380px]" />
      <div className="relative w-full max-w-[560px] rounded-2xl bg-[#f2f2f3]/90 px-10 py-14 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-dashed border-[#101828] bg-white">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#16a34a] text-white">
            <Check className="h-6 w-6 stroke-[3]" />
          </span>
        </span>
        <h1 className="mt-7 text-3xl font-extrabold text-[#101828]">You&apos;re all set!</h1>
        <p className="mx-auto mt-3 max-w-[360px] text-sm leading-5 text-[#98a2b3]">
          Your password has been reset successfully. You can now login with your new credentials
        </p>
        <button onClick={onBack} className="mt-8 h-12 w-full max-w-[430px] rounded-lg bg-[#2f54eb] text-sm font-bold text-white shadow-sm transition hover:bg-[#2447d8]">
          Back to Login
        </button>
      </div>
    </section>
  );
}

function FormHeading({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-4xl font-extrabold tracking-normal text-[#101828]">{title}</h2>
      <p className="mx-auto mt-3 max-w-[360px] text-sm leading-5 text-[#98a2b3]">{copy}</p>
    </div>
  );
}

function IconInput({
  icon,
  placeholder,
  type,
  trailing,
}: {
  icon: React.ReactNode;
  placeholder: string;
  type: string;
  trailing?: React.ReactNode;
}) {
  return (
    <label className="mt-7 flex h-11 items-center gap-3 border-b border-[#dfe3ea] text-[#2f54eb]">
      {icon}
      <input className="min-w-0 flex-1 bg-transparent text-sm text-[#101828] outline-none placeholder:text-[#98a2b3]" placeholder={placeholder} type={type} />
      {trailing ? <span className="text-[#2f54eb]">{trailing}</span> : null}
    </label>
  );
}

function PrimaryButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="mt-8 h-12 w-full rounded-lg bg-[#2f54eb] text-sm font-bold text-white shadow-sm transition hover:bg-[#2447d8]">
      {label}
    </button>
  );
}

function SocialButton({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} className="grid h-16 w-16 place-items-center rounded-lg border border-[#e4e7ec] bg-white shadow-sm transition hover:border-[#d0d5dd] hover:shadow-md">
      <span className="grid place-items-center">{icon}</span>
    </button>
  );
}
