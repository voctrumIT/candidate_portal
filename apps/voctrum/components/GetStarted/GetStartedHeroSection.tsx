"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ChangeEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Calendar, CheckCircle2, Clock, CreditCard, Lock, Rocket, ShieldCheck, Users } from "lucide-react"
import { axiosInstance } from "@/lib/axiosInstance"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function GetStartedHeroSection() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ fName: "", lName: "", email: "", pwd: "", tenantId: "" })
  const router = useRouter()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await axiosInstance.post("/auth/register", { form: formData })
      if (response.status === 201 || response.data.success) {
        toast.success("Registration Successful!", { description: "Your account has been created. Redirecting to login...", duration: 3000 })
        setTimeout(() => router.push("https://erp.voctrum.com/login"), 3000)
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.msg || error.response?.data?.error || "Something went wrong. Please try again."
      toast.error("Registration Failed", { description: errorMessage, duration: 5000 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-white px-4 pb-10 pt-32 md:px-8">
      <div className="mx-auto max-w-[1100px]">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start">

          {/* Left — Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="rounded-[24px] bg-white px-8 py-8 shadow-[0_20px_60px_rgba(48,73,154,0.10)]"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#172283]">Create Workspace</h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f5e9] px-3 py-1 text-[11px] font-semibold text-[#2e7d32]">
                🚀 30-day trial
              </span>
            </div>
            <p className="mb-6 text-sm text-[#6c78bd]">
              We use this info to set up your workspace shell and send you a verification email.
            </p>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label className="mb-1.5 block text-sm font-medium text-[#172283]">Company Name</Label>
                <Input placeholder="e.g Acme Corp" name="tenantId" value={formData.tenantId} onChange={handleChange} required
                  className="h-11 rounded-xl border-[#d6defd] bg-[#f7f9ff] text-sm placeholder:text-[#aab3d4]" />
              </div>

              <div>
                <Label className="mb-1.5 block text-sm font-medium text-[#172283]">Work email</Label>
                <Input type="email" placeholder="you@company.com" name="email" value={formData.email} onChange={handleChange} required
                  className="h-11 rounded-xl border-[#d6defd] bg-[#f7f9ff] text-sm placeholder:text-[#aab3d4]" />
              </div>

              <div>
                <Label className="mb-1.5 block text-sm font-medium text-[#172283]">Password</Label>
                <Input type="password" placeholder="Create a strong password" name="pwd" value={formData.pwd} onChange={handleChange} required
                  className="h-11 rounded-xl border-[#d6defd] bg-[#f7f9ff] text-sm placeholder:text-[#aab3d4]" />
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2">
                  <Checkbox id="terms" required />
                  <label htmlFor="terms" className="text-xs text-[#6c78bd]">
                    I agree to the{" "}
                    <Link href="/terms" className="font-medium text-[#456cff] hover:underline">Terms & Privacy Policy</Link>
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="updates" />
                  <label htmlFor="updates" className="text-xs text-[#6c78bd]">
                    Send me product updates and marketing emails (optional)
                  </label>
                </div>
              </div>

              <button type="submit"
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#456cff] text-sm font-semibold text-white shadow-[0_8px_24px_rgba(69,108,255,0.30)] transition hover:opacity-90"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Loading...
                  </span>
                ) : (
                  <>Create workspace <Rocket className="h-4 w-4" /></>
                )}
              </button>

              <div className="flex items-center justify-between pt-1 text-[11px] text-[#9ca8cc]">
                <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Enterprise-grade security</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Up to 10 users in a free trial</span>
              </div>
            </form>

            <p className="mt-5 text-center text-sm text-[#9ca8cc]">
              Already have access?{" "}
              <Link href="https://erp.voctrum.com/login" className="font-medium text-[#456cff] hover:underline">
                Sign in to your workspace
              </Link>
            </p>
          </motion.div>

          {/* Right — Info */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-5"
          >
            <span className="inline-flex rounded-full bg-[#456cff] px-4 py-1.5 text-xs font-semibold text-white">
              Products / Access
            </span>

            <h1 className="text-[42px] font-bold leading-[1.05] text-[#172283] md:text-[52px]">
              Create your{" "}<span className="text-[#456cff]">workspace</span>
            </h1>

            <p className="max-w-[420px] text-sm leading-snug text-[#6c78bd]">
              Get started with a 30-day free trial. No credit card required. Full access to all modules and features.
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                { icon: <Clock className="h-3.5 w-3.5" />, label: "30-day free trial", cls: "bg-[#e8edff] text-[#456cff]" },
                { icon: <CreditCard className="h-3.5 w-3.5" />, label: "No credit card", cls: "bg-[#fff3e0] text-[#e65100]" },
                { icon: <Rocket className="h-3.5 w-3.5" />, label: "Full access", cls: "bg-[#e8f5e9] text-[#2e7d32]" },
              ].map((b) => (
                <span key={b.label} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${b.cls}`}>
                  {b.icon}{b.label}
                </span>
              ))}
            </div>

            {/* Free trial includes */}
            <div className="rounded-[20px] border border-[#dbe4ff] bg-[#f8faff] p-6 shadow-[0_8px_30px_rgba(48,73,154,0.05)]">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef2ff]">
                  <Rocket className="h-5 w-5 text-[#456cff]" />
                </span>
                <div>
                  <p className="font-bold text-[#172283]">Free trial includes</p>
                  <p className="text-xs text-[#9ca8cc]">Everything you need to get started</p>
                </div>
              </div>
              <ul className="space-y-2.5">
                {["Full access to all 6 ERP modules", "Up to 10 team members", "1GB storage included", "Sample data and templates", "Guided onboarding tour"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[#4a5580]">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#456cff]" />{item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Provisioning options */}
            <div className="rounded-[20px] bg-[#eef1f6] p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                  <ShieldCheck className="h-5 w-5 text-[#7c3aed]" />
                </span>
                <div>
                  <p className="font-bold text-[#172283]">Provisioning options</p>
                  <p className="text-xs text-[#9ca8cc]">Flexible setup for any team size</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { title: "SSO (SAML/OIDC)", desc: "Enterprise-grade single sign-on with major providers including Google Workspace, Microsoft, Okta, and OneLogin." },
                  { title: "Email-first invites", desc: "Simple invitation-based onboarding for smaller teams. Send invites and manage access easily." },
                  { title: "SCIM provisioning", desc: "Automated user provisioning and deprovisioning with SCIM 2.0 compliance for enterprise organizations." },
                ].map((item) => (
                  <div key={item.title}>
                    <p className="text-sm font-semibold text-[#172283]">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-snug text-[#9ca8cc]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* What happens next */}
            <div className="rounded-[20px] bg-[#eef1f6] p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                  <Calendar className="h-5 w-5 text-[#456cff]" />
                </span>
                <div>
                  <p className="font-bold text-[#172283]">What happens next?</p>
                  <p className="text-xs text-[#9ca8cc]">Your 30-day journey starts now</p>
                </div>
              </div>
              <ol className="space-y-2.5">
                {["Verify your email address", "Set up your workspace profile", "Create account for team members", "Import your data (optional)", "Start exploring modules"].map((step, i) => (
                  <li key={step} className="flex items-center gap-3 text-sm text-[#4a5580]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-xs font-bold text-[#456cff]">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
