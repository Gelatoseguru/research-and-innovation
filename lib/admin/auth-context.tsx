"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AdminAccount } from "./types";
import { backendFetch } from "@/lib/backend";

interface AuthContextValue {
  admin: AdminAccount | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    backendFetch("auth/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((body) => setAdmin(body.user?.role === "admin" ? body.user : null))
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const response = await backendFetch("auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const body = await response.json();
    if (!response.ok || body.user?.role !== "admin") {
      return { ok: false, error: body.error ?? "Invalid administrator credentials." };
    }
    setAdmin(body.user as AdminAccount);
    return { ok: true };
  }

  function logout() {
    setAdmin(null);
    void backendFetch("auth/logout", { method: "POST" });
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside <AuthProvider>");
  return ctx;
}
