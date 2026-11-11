"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { profileService } from "../services/profile";
import { fetchApi } from "../lib/api";
import { useRouter } from "next/navigation";

import { EducationDto } from "../services/profile";
import { toast } from "../app/components/Toast";

export interface TenantInfo {
  companyName?: string;
  logoUrl?: string;
  websiteUrl?: string;
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
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [tenantLoading, setTenantLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchTenant = async () => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTenant = params.get("tenant");

      if (urlTenant) {
        const normalizedTenantId = urlTenant.replace(/^["']|["']$/g, "").trim();
        if (normalizedTenantId) {
          localStorage.setItem("tenant_id", normalizedTenantId);
          document.cookie = `erp_tenant_id=${normalizedTenantId}; path=/; max-age=31536000; SameSite=Lax`;

          params.delete("tenant");
          const remainingQuery = params.toString() ? `?${params.toString()}` : "";
          window.history.replaceState({}, document.title, `${window.location.pathname}${remainingQuery}`);
        }
      }

      const activeTenant = localStorage.getItem("tenant_id") || "dotnetapi";

      const res = await fetchApi("/api/Candidate/tenant", {
        headers: { "X-Tenant-ID": activeTenant },
      });
      const data = res?.payload || res;
      if (data) {
        setTenant(data);
      }
    } catch (err) {
      console.warn("Failed to fetch tenant info:", err);
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

        setUser({
          ...payload,
          candidateId: payload.candidateId || localStorage.getItem("candidate_id") || undefined,
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
