"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const CursorSpotlight = dynamic(
  () => import("@/features/shared/cursor-spotlight").then((mod) => mod.CursorSpotlight),
  { ssr: false }
);

const ScrollAiBeam = dynamic(
  () => import("@/features/shared/scroll-ai-beam").then((mod) => mod.ScrollAiBeam),
  { ssr: false }
);

export function GlobalEffects() {
  const pathname = usePathname();

  const shouldRenderEffects = pathname === "/" || pathname.startsWith("/skills");
  if (!shouldRenderEffects) {
    return null;
  }

  return (
    <>
      <ScrollAiBeam />
      <CursorSpotlight />
    </>
  );
}
