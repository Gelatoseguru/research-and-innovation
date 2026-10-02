"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AdminAccount } from "./types";

// ---------------------------------------------------------------------
// DEMO CREDENTIALS ONLY. Everything in this file is a placeholder for a
// real authentication flow. Once the backend exists, replace `login()`
// below with a call to something like POST /api/admin/login, which:
//   - checks a hashed password against a MongoDB `admins` collection
//   - returns a signed, httpOnly session cookie
//   - lets a Next.js middleware.ts verify that cookie on every /admin
//     request server-side (this mock only checks client-side, in
//     RequireAdminAuth, which is NOT sufficient security on its own —
//     someone could disable JS or call your API routes directly).
// The role field is already wired through the types, so if a second
// tier (e.g. a super admin who manages other admin accounts) is needed
// later, it can be added back to the Role type and DEMO_ACCOUNTS below
// without restructuring this file.
// ---------------------------------------------------------------------

const DEMO_ACCOUNTS: (AdminAccount & { password: string })[] = [
  {
    id: "adm-1",
    name: "Inday Lustay",
    email: "inday@lnu.edu.ph",
    password: "admin123",
    role: "admin",
  },
  {
    id: "adm-2",
    name: "K. Gandako",
    email: "K.Tifa@lnu.edu.ph",
    password: "rimo2026",
    role: "admin",
  },
];

const STORAGE_KEY = "lnu-admin-session";

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
    queueMicrotask(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) setAdmin(JSON.parse(raw));
      } catch {
        // ignore malformed/missing session
      }
      setLoading(false);
    });
  }, []);

  async function login(email: string, password: string) {
    await new Promise((r) => setTimeout(r, 400)); // simulate network latency
    const match = DEMO_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
    );
    if (!match) return { ok: false, error: "Invalid email or password." };
    const account: AdminAccount = {
      id: match.id,
      name: match.name,
      email: match.email,
      role: match.role,
    };
    setAdmin(account);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
    return { ok: true };
  }

  function logout() {
    setAdmin(null);
    window.localStorage.removeItem(STORAGE_KEY);
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
