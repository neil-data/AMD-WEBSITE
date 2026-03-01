"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { SiteNavbar } from "@/features/landing/site-navbar";
import { LandingFooter } from "@/features/landing/landing-footer";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/services/firebase/client";

type UserRole = "student" | "recruiter" | "admin";

const roleMeta: Record<Exclude<UserRole, "admin">, { title: string; subtitle: string; dashboard: string }> = {
  student: {
    title: "Student Access",
    subtitle: "Practice DSA, join learning exchange, and grow leaderboard rank.",
    dashboard: "/dashboard/student/overview"
  },
  recruiter: {
    title: "Recruiter Access",
    subtitle: "Review hiring pipeline and complete candidate records.",
    dashboard: "/dashboard/recruiter/overview"
  }
};

function dashboardPathByRole(role: UserRole) {
  if (role === "recruiter") {
    return "/dashboard/recruiter/overview";
  }

  if (role === "admin") {
    return "/dashboard/admin/overview";
  }

  return "/dashboard/student/overview";
}

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { push } = useToast();

  const role = searchParams.get("role") === "recruiter" ? "recruiter" : "student";
  const mode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const active = roleMeta[role];

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const upsertUserProfileAndGetRole = async ({
    uid,
    emailAddress,
    name,
    fallbackRole
  }: {
    uid: string;
    emailAddress: string | null;
    name: string;
    fallbackRole: Exclude<UserRole, "admin">;
  }): Promise<UserRole> => {
    const userRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userRef);
    const existingRole = userSnapshot.data()?.role;
    const targetRole: UserRole = existingRole === "recruiter" || existingRole === "admin" ? existingRole : fallbackRole;

    if (!userSnapshot.exists()) {
      await setDoc(
        userRef,
        {
          displayName: name,
          email: emailAddress,
          role: targetRole,
          skillRankScore: 1000,
          integrityScore: 90,
          contributionScore: 0,
          percentile: 50,
          aiRiskLevel: "Low",
          badges: [],
          completedChallenges: [],
          exchangeHistory: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
    }

    return targetRole;
  };

  const canSubmit = useMemo(() => {
    const hasIdentity = mode === "signup" ? displayName.trim().length >= 2 : true;
    return hasIdentity && email.trim().length > 5 && password.length >= 6;
  }, [displayName, email, password, mode]);

  async function submitAuth(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) {
      push("Provide valid credentials before continuing", "error");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (displayName.trim()) {
          await updateProfile(credential.user, { displayName: displayName.trim() });
        }

        await setDoc(
          doc(db, "users", credential.user.uid),
          {
            displayName: displayName.trim(),
            email: credential.user.email,
            role,
            skillRankScore: 1000,
            integrityScore: 90,
            contributionScore: 0,
            percentile: 50,
            aiRiskLevel: "Low",
            badges: [],
            completedChallenges: [],
            exchangeHistory: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          },
          { merge: true }
        );

        push("Account created successfully", "success");
        router.push(roleMeta[role].dashboard);
        return;
      }

      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const targetRole = await upsertUserProfileAndGetRole({
        uid: credential.user.uid,
        emailAddress: credential.user.email,
        name: credential.user.displayName ?? "",
        fallbackRole: role
      });

      push("Logged in successfully", "success");
      router.push(dashboardPathByRole(targetRole));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Authentication failed";
      push(message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function continueWithGoogle() {
    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);

      const targetRole = await upsertUserProfileAndGetRole({
        uid: credential.user.uid,
        emailAddress: credential.user.email,
        name: credential.user.displayName ?? "",
        fallbackRole: role
      });

      push("Google sign-in successful", "success");
      router.push(dashboardPathByRole(targetRole));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Google login failed";
      push(message, "error");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-bg">
      <SiteNavbar />
      <div className="mx-auto flex w-full max-w-5xl items-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="w-full space-y-6"
        >
          <div>
            <h1 className="font-display text-5xl font-bold tracking-tightest">{mode === "login" ? "Login" : "Sign Up"}</h1>
            <p className="mt-2 text-sm text-text-secondary">Authenticate with Firebase and continue to your role dashboard.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className={role === "student" ? "border-white/30" : ""}>
              <h2 className="font-display text-2xl font-semibold tracking-tightest">Student</h2>
              <p className="mt-2 text-sm text-text-secondary">Solve challenges, collaborate, and improve rank.</p>
              <div className="mt-5 flex gap-2">
                <Link href="/auth?role=student&mode=login" className="rounded-xl border border-border px-4 py-2 text-xs text-text-secondary hover:text-text-primary">
                  Login
                </Link>
                <Link href="/auth?role=student&mode=signup" className="rounded-xl border border-border px-4 py-2 text-xs text-text-secondary hover:text-text-primary">
                  Sign Up
                </Link>
              </div>
            </Card>

            <Card className={role === "recruiter" ? "border-white/30" : ""}>
              <h2 className="font-display text-2xl font-semibold tracking-tightest">Recruiter</h2>
              <p className="mt-2 text-sm text-text-secondary">Hire using verified performance signals and logs.</p>
              <div className="mt-5 flex gap-2">
                <Link href="/auth?role=recruiter&mode=login" className="rounded-xl border border-border px-4 py-2 text-xs text-text-secondary hover:text-text-primary">
                  Login
                </Link>
                <Link href="/auth?role=recruiter&mode=signup" className="rounded-xl border border-border px-4 py-2 text-xs text-text-secondary hover:text-text-primary">
                  Sign Up
                </Link>
              </div>
            </Card>
          </div>

          <Card>
            <h3 className="font-display text-2xl font-semibold tracking-tightest">{active.title}</h3>
            <p className="mt-2 text-sm text-text-secondary">{active.subtitle}</p>

            <form onSubmit={submitAuth} className="mt-5 space-y-3">
              {mode === "signup" ? (
                <input
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Display name"
                  className="w-full rounded-xl border border-border bg-bg/60 px-3 py-2 text-sm text-text-primary outline-none"
                />
              ) : null}

              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="Email"
                className="w-full rounded-xl border border-border bg-bg/60 px-3 py-2 text-sm text-text-primary outline-none"
              />

              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="Password"
                className="w-full rounded-xl border border-border bg-bg/60 px-3 py-2 text-sm text-text-primary outline-none"
              />

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={loading || googleLoading || !canSubmit}
                  className="rounded-xl border border-white/25 bg-white/5 px-4 py-2 text-xs hover:shadow-glow disabled:opacity-60"
                >
                  {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
                </button>
                <button
                  type="button"
                  onClick={continueWithGoogle}
                  disabled={loading || googleLoading}
                  className="rounded-xl border border-border px-4 py-2 text-xs text-text-secondary hover:text-text-primary disabled:opacity-60"
                >
                  {googleLoading ? "Opening Google..." : "Continue with Google"}
                </button>
                <Link href="/" className="rounded-xl border border-border px-4 py-2 text-xs text-text-secondary hover:text-text-primary">
                  Back to Home
                </Link>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
      <LandingFooter />
    </main>
  );
}
