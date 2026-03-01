"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/services/firebase/client";

type UserRole = "student" | "recruiter" | "admin";

type AuthContextValue = {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  signOutUser: () => Promise<void>;
  refreshRole: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchUserRole(userId: string): Promise<UserRole> {
  const userRef = doc(db, "users", userId);
  const snapshot = await getDoc(userRef);
  const value = snapshot.data()?.role;
  if (value === "recruiter" || value === "admin") {
    return value;
  }
  return "student";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setRole(null);
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("skillrank:user-role");
        }
        setLoading(false);
        return;
      }

      const cachedRole = typeof window !== "undefined" ? window.localStorage.getItem("skillrank:user-role") : null;
      if (cachedRole === "student" || cachedRole === "recruiter" || cachedRole === "admin") {
        setRole(cachedRole);
      }
      setLoading(false);

      const nextRole = await fetchUserRole(nextUser.uid);
      setRole(nextRole);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("skillrank:user-role", nextRole);
      }
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role,
      loading,
      signOutUser: async () => {
        await signOut(auth);
      },
      refreshRole: async () => {
        if (!auth.currentUser) {
          setRole(null);
          if (typeof window !== "undefined") {
            window.localStorage.removeItem("skillrank:user-role");
          }
          return;
        }

        const latestRole = await fetchUserRole(auth.currentUser.uid);
        setRole(latestRole);
        if (typeof window !== "undefined") {
          window.localStorage.setItem("skillrank:user-role", latestRole);
        }
      }
    }),
    [user, role, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
