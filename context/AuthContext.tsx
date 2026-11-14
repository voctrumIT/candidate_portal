"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef, ReactNode } from "react";
import { profileService } from "../services/profile";
import { fetchApi } from "../lib/api";
import { useRouter } from "next/navigation";

import { EducationDto } from "../services/profile";
import { toast } from "../app/components/Toast";

export interface TenantInfo {
  tenantId?: string;
  normalizedTenantId?: string;
  companyName?: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  location?: string;
  activeJobsCount?: number;
  rating?: number;
  addresses?: any[];
  [key: string]: any;
}

export interface UserProfile {
  candidateId?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  contactNumber?: string;
  mobile?: string;
  aboutMe?: string;
  summary?: string;
  about?: string;
  bio?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  preferredWorkLocation?: string;
  currentLocation?: string;
  skills?: string[];
  educations?: EducationDto[];
  workExperiences?: any[];
  experiences?: any[];
  address?: {
    addressLine1?: string | null;
    addressLine2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    country?: string | null;
  } | null;
  [key: string]: any;
}

interface AuthContextType {
  user: UserProfile | null;
  tenant: TenantInfo | null;
  tenantLoading: boolean;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  tenant: null,
  tenantLoading: true,
  loading: true,
  refreshProfile: async () => { },
  logout: () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("candidate_profile_cache");
        if (cached) return JSON.parse(cached);
      } catch { }
    }
    return null;
  });
  const [tenant, setTenant] = useState<TenantInfo | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("candidate_tenant_data");
        if (cached) return JSON.parse(cached);
      } catch { }
    }
    return {
      companyName: "Voctrum",
      description:
        "Explore thousands of job opportunities tailored to your unique skills, experience, and career aspirations.",
      logoUrl: "/common/logo.png",
      websiteUrl: "https://voctrum.com",
      location: "Global / Remote",
    };
  });
  const [tenantLoading, setTenantLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchTenant = async () => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTenant = params.get("tenant") || params.get("tenantId");

      if (urlTenant) {
        const normalizedTenantId = urlTenant.replace(/^["']|["']$/g, "").trim();
        if (normalizedTenantId) {
          localStorage.setItem("tenant_id", normalizedTenantId);
          document.cookie = `erp_tenant_id=${normalizedTenantId}; path=/; max-age=31536000; SameSite=Lax`;

          params.delete("tenant");
          params.delete("tenantId");
          const remainingQuery = params.toString() ? `?${params.toString()}` : "";
          window.history.replaceState({}, document.title, `${window.location.pathname}${remainingQuery}`);
        }
      }

      const activeTenant = localStorage.getItem("tenant_id") || "dotnetapi";
      let tenantData: TenantInfo = {};

      // Fetch tenant jobs and tenant profile in parallel to load logo and tenant details instantly
      const [jobsSettled, tenantSettled] = await Promise.allSettled([
        fetchApi(`/api/Candidate/tenants/${encodeURIComponent(activeTenant)}/jobs`),
        fetchApi("/api/Candidate/tenant", {
          headers: { "X-Tenant-ID": activeTenant },
        }),
      ]);

      if (jobsSettled.status === "fulfilled" && jobsSettled.value) {
        const jobsPayload = jobsSettled.value?.payload || jobsSettled.value;
        if (jobsPayload?.tenant) {
          const t = jobsPayload.tenant;
          const totalJobs = jobsPayload?.pagination?.total ?? (Array.isArray(jobsPayload?.jobs) ? jobsPayload.jobs.length : 0);
          tenantData = {
            tenantId: t.tenantId,
            normalizedTenantId: t.normalizedTenantId || activeTenant,
            companyName: t.companyName || "Voctrum",
            logoUrl: t.logoUrl && t.logoUrl.startsWith("http") ? t.logoUrl : "/common/logo.png",
            websiteUrl: t.websiteUrl || "https://voctrum.com",
            contactEmail: t.contactEmail || "admin@voctrum.com",
            activeJobsCount: totalJobs,
            description: t.description,
          };
        }
      }

      if (tenantSettled.status === "fulfilled" && tenantSettled.value) {
        const data = tenantSettled.value?.payload || tenantSettled.value;
        if (data) {
          const primaryAddr = Array.isArray(data.addresses)
            ? data.addresses.find((a: any) => a.isPrimary) || data.addresses[0]
            : null;
          const locParts = [primaryAddr?.city, primaryAddr?.state, primaryAddr?.country].filter(Boolean);
          const location = locParts.length > 0 ? locParts.join(", ") : "Global / Remote";

          tenantData = {
            ...tenantData,
            companyName: tenantData.companyName || data.companyName || "Voctrum",
            description:
              data.description && data.description.trim()
                ? data.description
                : tenantData.description ||
                `Explore thousands of job opportunities tailored to your unique skills, experience, and career aspirations at ${tenantData.companyName || "Voctrum"}.`,
            logoUrl:
              tenantData.logoUrl && tenantData.logoUrl !== "/common/logo.png"
                ? tenantData.logoUrl
                : (data.logoUrl && data.logoUrl.startsWith("http") ? data.logoUrl : "/common/logo.png"),
            websiteUrl: tenantData.websiteUrl || data.websiteUrl || "https://voctrum.com",
            contactEmail: tenantData.contactEmail || data.contactEmail || "admin@voctrum.com",
            contactPhone: data.contactPhone || "",
            location,
            rating: typeof data.rating === "number" && data.rating > 0 ? data.rating : 4.8,
            addresses: data.addresses || [],
            socialLinks: data.socialLinks || {},
            facebookUrl: data.facebookUrl || data.facebook || null,
            twitterUrl: data.twitterUrl || data.twitter || data.xUrl || null,
            linkedinUrl: data.linkedinUrl || data.linkedin || null,
            instagramUrl: data.instagramUrl || data.instagram || null,
            youtubeUrl: data.youtubeUrl || data.youtube || null,
            githubUrl: data.githubUrl || data.github || null,
          };
        }
      }

      if (!tenantData.companyName) {
        tenantData.companyName = "Voctrum";
      }
      if (!tenantData.description) {
        tenantData.description = `Explore thousands of job opportunities tailored to your unique skills, experience, and career aspirations at ${tenantData.companyName}.`;
      }
      if (!tenantData.logoUrl) {
        tenantData.logoUrl = "/common/logo.png";
      }

      setTenant(tenantData);
      localStorage.setItem("candidate_tenant_data", JSON.stringify(tenantData));
    } catch (err) {
      console.warn("Failed to process tenant info:", err);
    } finally {
      setTenantLoading(false);
    }
  };

  const inFlightProfilePromise = useRef<Promise<void> | null>(null);
  const lastProfileFetchTime = useRef<number>(0);

  const fetchProfile = useCallback(async (force = false) => {
    // If a request is already in-flight, reuse it to avoid duplicate parallel calls
    if (inFlightProfilePromise.current) {
      return inFlightProfilePromise.current;
    }

    // Anti-spam throttling: if fetched within last 2.5s and not forced, reuse current state
    const now = Date.now();
    if (!force && now - lastProfileFetchTime.current < 2500) {
      return;
    }

    const task = (async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("candidate_token") : null;
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const data = await profileService.getProfile();
        lastProfileFetchTime.current = Date.now();
        const payload = data?.payload || data;
        if (payload) {
          const [firstName, ...lastNames] = (payload.name || "").split(" ");
          const lastName = lastNames.join(" ") || "";
          let addr = payload.address || {};
          if (typeof window !== "undefined" && !addr.addressLine1 && !addr.city) {
            try {
              const cached = localStorage.getItem("candidate_address");
              if (cached) {
                addr = { ...JSON.parse(cached), ...addr };
              }
            } catch { }
          }

          const candidateId = payload.candidateId || localStorage.getItem("candidate_id") || undefined;
          if (typeof window !== "undefined") {
            try {
              if (candidateId) localStorage.setItem("candidate_id", candidateId);
              if (payload.name) localStorage.setItem("candidate_name", payload.name);
              if (payload.contactNumber) localStorage.setItem("candidate_contact", payload.contactNumber);
            } catch { }
          }

          const candidateAbout = payload.aboutMe || payload.about || payload.summary || payload.bio || "";

          const rawExp = payload.workExperiences || payload.experiences || payload.experience || [];
          const candidateExperiences: any[] = Array.isArray(rawExp)
            ? rawExp.map((we: any, i: number) => {
              const isCurrent = Boolean(
                we.current ||
                we.currentRole ||
                we.isCurrent ||
                String(we.endDate || "").toLowerCase() === "present" ||
                !we.endDate
              );
              const roleTitle = (we.designation || we.role || we.title || we.position || we.jobTitle || "").trim();
              const compName = (we.organization || we.company || we.companyName || "").trim();
              return {
                id: we.id || `we-${i}`,
                role: roleTitle || "Professional",
                designation: roleTitle || "Professional",
                title: roleTitle || "Professional",
                company: compName || "",
                organization: compName || "",
                companyName: compName || "",
                location: we.location || "",
                employmentType: we.employmentType || "Full-time",
                startDate: we.startDate || "",
                endDate: isCurrent ? null : (we.endDate || null),
                currentRole: isCurrent,
                current: isCurrent,
                isCurrent: isCurrent,
                skills: Array.isArray(we.skills) ? we.skills : [],
                description: we.description || we.responsibilities || "",
              };
            })
            : [];

          const fullProfile: UserProfile = {
            ...payload,
            candidateId,
            firstName,
            lastName,
            aboutMe: candidateAbout,
            summary: candidateAbout,
            about: candidateAbout,
            bio: candidateAbout,
            contactNumber: payload.contactNumber || "",
            mobile: payload.contactNumber || "",
            addressLine1: addr.addressLine1 || "",
            addressLine2: addr.addressLine2 || "",
            city: addr.city || "",
            state: addr.state || "",
            country: addr.country || "",
            postalCode: addr.postalCode || "",
            preferredWorkLocation: addr.city || "",
            currentLocation: addr.city || "",
            skills: Array.isArray(payload.skills) ? payload.skills : [],
            educations: Array.isArray(payload.educations) ? payload.educations : [],
            workExperiences: candidateExperiences,
            experiences: candidateExperiences,
            address: addr,
          };

          setUser(fullProfile);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("candidate_profile_cache", JSON.stringify(fullProfile));
            } catch { }
          }
        } else if (!token) {
          setUser(null);
          if (typeof window !== "undefined") {
            localStorage.removeItem("candidate_profile_cache");
          }
        }
      } catch (err: any) {
        console.error("Failed to fetch profile", err);
        // Only clear user on explicit 401 Unauthorized so transient errors don't wipe active profile state
        if (err?.status === 401) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("candidate_token");
            localStorage.removeItem("candidate_profile_cache");
          }
          setUser(null);
        }
      } finally {
        setLoading(false);
        inFlightProfilePromise.current = null;
      }
    })();

    inFlightProfilePromise.current = task;
    return task;
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("candidate_token");
      localStorage.removeItem("candidate_id");
      localStorage.removeItem("candidate_profile_cache");
      localStorage.removeItem("candidate_address");
      localStorage.removeItem("candidate_active_resume_id");
      localStorage.removeItem("candidate_active_resume_name");
      localStorage.removeItem("candidate_active_resume_url");
      localStorage.removeItem("candidate_active_resume");
      localStorage.removeItem("candidate_active_resume_owner_id");
      localStorage.removeItem("candidate_active_resume_updated_at");
      localStorage.removeItem("candidate_about_me");
      localStorage.removeItem("candidate_work_experience");
      localStorage.removeItem("candidate_applied_jobs");
      localStorage.removeItem("candidate_local_applications");
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("active_resume_updated"));
    }
    setUser(null);
    toast.info("Signed Out", "You have been safely signed out of your account.");
    router.push("/login");
  }, [router]);

  useEffect(() => {
    fetchTenant();
    fetchProfile();

    const handleProfileUpdate = () => {
      fetchProfile(true);
    };

    window.addEventListener("candidate_profile_updated", handleProfileUpdate);
    return () => {
      window.removeEventListener("candidate_profile_updated", handleProfileUpdate);
    };
  }, [fetchProfile]);

  const authContextValue = useMemo(() => ({
    user,
    tenant,
    tenantLoading,
    loading,
    refreshProfile: fetchProfile,
    logout,
  }), [user, tenant, tenantLoading, loading, fetchProfile, logout]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
