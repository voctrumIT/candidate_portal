"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { profileService } from "../services/profile";
import { useRouter } from "next/navigation";

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  preferredWorkLocation?: string;
  currentLocation?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshProfile: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
        setUser({
          ...payload,
          firstName,
          lastName,
          mobile: payload.contactNumber || "",
          preferredWorkLocation: payload.address?.city || "",
          currentLocation: payload.address?.city || ""
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
    localStorage.removeItem("candidate_token");
    setUser(null);
    router.push("/login");
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshProfile: fetchProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
