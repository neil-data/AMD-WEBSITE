import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ToastViewport } from "@/components/ui/toast";
import { AuthProvider } from "@/features/shared/auth-provider";
import { GlobalEffects } from "@/features/shared/global-effects";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["600", "700"],
  preload: true
});

export const metadata: Metadata = {
  title: "SkillRank AI",
  description: "Performance-Verified, Integrity-Protected Skill Exchange Ecosystem"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans bg-bg text-text-primary">
        <AuthProvider>
          <GlobalEffects />
          {children}
          <ToastViewport />
        </AuthProvider>
      </body>
    </html>
  );
}
