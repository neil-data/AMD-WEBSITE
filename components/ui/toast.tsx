"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function ToastViewport() {
  const { items, remove } = useToast();

  useEffect(() => {
    const timers = items.map((item) =>
      setTimeout(() => {
        remove(item.id);
      }, 2400)
    );
    return () => timers.forEach(clearTimeout);
  }, [items, remove]);

  return (
    <div className="fixed right-4 top-4 z-50 flex w-72 flex-col gap-2">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.24, ease: "easeInOut" }}
            className="rounded-xl border border-border bg-surface p-3 text-sm text-text-primary"
          >
            <span className={item.kind === "success" ? "pulse-success" : item.kind === "error" ? "shake-error" : ""}>{item.title}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}