"use client";

import { motion } from "framer-motion";
import { HTMLMotionProps } from "framer-motion";
import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children?: ReactNode;
  loading?: boolean;
};

export function Button({ className, loading, children, ...props }: ButtonProps) {
  const [ripple, setRipple] = useState(false);

  return (
    <motion.button
      whileHover={{ scale: 1.02, boxShadow: "0 0 0 1px rgba(255,255,255,0.25), 0 0 24px rgba(255,255,255,0.12)" }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      onClick={(event) => {
        setRipple(false);
        requestAnimationFrame(() => setRipple(true));
        props.onClick?.(event);
      }}
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary",
        "transition-all duration-200 disabled:opacity-50",
        className
      )}
      {...props}
    >
      {loading ? <span className="inline-flex h-4 w-20 skeleton rounded" /> : children}
      {ripple ? <span className="pointer-events-none absolute inset-0 animate-ping rounded-xl bg-white/10" /> : null}
    </motion.button>
  );
}
