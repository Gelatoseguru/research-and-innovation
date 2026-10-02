"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { backendFetch } from "@/lib/backend";

export type StudentUser = {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  avatarUrl?: string | null;
};

type AuthResult = { ok: true } | { ok: false; error: string };

type StudentAuthContextValue = {
  user: StudentUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const StudentAuthContext = createContext<StudentAuthContextValue | null>(null);

async function requestAuth(path: string, payload: Record<string, string>) {
  const response = await backendFetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await response.json();
  return { response, body };
}

export function StudentAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StudentUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response = await backendFetch("auth/session", { cache: "no-store" });
      const body = await response.json();
      setUser(body.user ?? null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function login(email: string, password: string): Promise<AuthResult> {
    const { response, body } = await requestAuth("auth/login", { email, password });
    if (!response.ok) return { ok: false, error: body.error ?? "Unable to sign in." };
    setUser(body.user);
    return { ok: true };
  }

  async function register(name: string, email: string, password: string): Promise<AuthResult> {
    const { response, body } = await requestAuth("auth/register", { name, email, password });
    if (!response.ok) return { ok: false, error: body.error ?? "Unable to create your account." };
    setUser(body.user);
    return { ok: true };
  }

  async function logout() {
    await backendFetch("auth/logout", { method: "POST" });
    setUser(null);
  }

  return (
    <StudentAuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </StudentAuthContext.Provider>
  );
}

export function useStudentAuth() {
  const context = useContext(StudentAuthContext);
  if (!context) throw new Error("useStudentAuth must be used inside StudentAuthProvider.");
  return context;
}
