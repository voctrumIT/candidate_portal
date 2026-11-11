"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
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
  refreshProfile: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tenant, setTenant] = useState<TenantInfo | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("candidate_tenant_data");
        if (cached) return JSON.parse(cached);
      } catch {}
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
  const [tenantLoading, setTenantLoading] = useState(true);
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

      // 1. Fetch from GET /api/Candidate/tenants/{tenantId}/jobs
      try {
        const jobsRes = await fetchApi(`/api/Candidate/tenants/${encodeURIComponent(activeTenant)}/jobs`);
        const jobsPayload = jobsRes?.payload || jobsRes;
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
      } catch (err) {
        console.warn("Tenant jobs fetch notice:", err);
      }

      // 2. Fetch full tenant profile for description, addresses, and phone
      try {
        const res = await fetchApi("/api/Candidate/tenant", {
          headers: { "X-Tenant-ID": activeTenant },
        });
        const data = res?.payload || res;
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
      } catch (err) {
        console.warn("Failed to fetch tenant info:", err);
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

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("candidate_token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const data = await profileService.getProfile();
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
          } catch {}
        }

        const candidateId = payload.candidateId || localStorage.getItem("candidate_id") || undefined;
        if (candidateId && typeof window !== "undefined") {
          try {
            localStorage.setItem("candidate_id", candidateId);
          } catch {}
        }

        const rawExp = payload.workExperiences || payload.experiences || payload.experience;
        let candidateExperiences: any[] = [];
        if (Array.isArray(rawExp) && rawExp.length > 0) {
          candidateExperiences = rawExp;
          try {
            localStorage.setItem("candidate_work_experience", JSON.stringify(rawExp));
          } catch {}
        } else if (typeof window !== "undefined") {
          try {
            const cached = localStorage.getItem("candidate_work_experience");
            if (cached) candidateExperiences = JSON.parse(cached);
          } catch {}
        }

        setUser({
          ...payload,
          candidateId,
          firstName,
          lastName,
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
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("candidate_token");
      localStorage.removeItem("candidate_id");
      localStorage.removeItem("candidate_address");
      window.dispatchEvent(new Event("storage"));
    }
    setUser(null);
    toast.info("Signed Out", "You have been safely signed out of your account.");
    router.push("/login");
  };

  useEffect(() => {
    fetchTenant();
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, tenant, tenantLoading, loading, refreshProfile: fetchProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
