"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function AnimatedModalDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <h3 className="mb-3 text-sm font-semibold">Challenge Review Modal</h3>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.22 }}
              className="w-full max-w-md rounded-2xl border border-border bg-surface p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <h4 className="text-lg font-semibold">Submission Review</h4>
              <p className="mt-2 text-sm text-text-secondary">AI confidence low. Explanation consistency high. Ready for verification.</p>
              <div className="mt-4 flex justify-end">
                <Button onClick={() => setOpen(false)}>Close</Button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Card>
  );
}