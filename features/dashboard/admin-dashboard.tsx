"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";
import { CountUp } from "@/features/dashboard/count-up";
import { adminMetrics, flaggedSubmissionLogs, skillExchanges } from "@/lib/mock-platform-data";

type AdminSection = "overview" | "logs" | "analytics";

export function AdminDashboard({ section }: { section?: string }) {
  const activeSection: AdminSection = section === "logs" || section === "analytics" ? section : "overview";
  const [query, setQuery] = useState("");

  const filteredLogs = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return flaggedSubmissionLogs;
    }

    return flaggedSubmissionLogs.filter(
      (log) =>
        log.userId.toLowerCase().includes(needle) ||
        log.challengeId.toLowerCase().includes(needle) ||
        log.id.toLowerCase().includes(needle)
    );
  }, [query]);

  const integrityDistribution = useMemo(
    () => ({
      high: 72,
      medium: 21,
      low: 7
    }),
    []
  );

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } } }}
      className="space-y-6 p-6"
    >
      <SectionTitle
        title="Admin Dashboard"
        subtitle="Platform health, flagged AI misuse monitoring, exchange activity, and integrity distribution for operations and compliance."
      />

      <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="grid gap-3 md:grid-cols-4 xl:grid-cols-7">
        <Card className="p-4">
          <p className="text-[11px] text-text-secondary">Total users</p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-tightest"><CountUp value={adminMetrics.totalUsers} /></p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] text-text-secondary">AI misuse rate</p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-tightest"><CountUp value={adminMetrics.aiMisuseRate} suffix="%" /></p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] text-text-secondary">Average SkillScore</p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-tightest"><CountUp value={adminMetrics.averageSkillScore} suffix="%" /></p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] text-text-secondary">Active exchanges</p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-tightest"><CountUp value={adminMetrics.activeExchanges} /></p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] text-text-secondary">Failed baseline tests</p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-tightest"><CountUp value={adminMetrics.failedBaselineTests} /></p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] text-text-secondary">Integrity High</p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-tightest"><CountUp value={integrityDistribution.high} suffix="%" /></p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] text-text-secondary">Flagged logs</p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-tightest"><CountUp value={flaggedSubmissionLogs.length} /></p>
        </Card>
      </motion.div>

      {(activeSection === "overview" || activeSection === "analytics") ? (
        <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="font-display text-2xl font-semibold tracking-tightest">Integrity Distribution</h3>
            <p className="mt-1 text-xs text-text-secondary">Platform-wide trust posture split by high, medium, and low integrity cohorts.</p>
            <div className="mt-4 space-y-3 text-xs text-text-secondary">
              <div className="rounded-xl border border-border bg-bg/40 p-3">High (85-100): {integrityDistribution.high}%</div>
              <div className="rounded-xl border border-border bg-bg/40 p-3">Medium (65-84): {integrityDistribution.medium}%</div>
              <div className="rounded-xl border border-border bg-bg/40 p-3">Low (0-64): {integrityDistribution.low}%</div>
            </div>
          </Card>

          <Card>
            <h3 className="font-display text-2xl font-semibold tracking-tightest">Most Requested Skills</h3>
            <p className="mt-1 text-xs text-text-secondary">Demand signals from exchange requests and learning goals.</p>
            <div className="mt-4 space-y-2">
              {adminMetrics.mostRequestedSkills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.16, delay: index * 0.04 }}
                  className="rounded-xl border border-border bg-bg/40 p-3 text-sm text-text-primary"
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      ) : null}

      {(activeSection === "overview" || activeSection === "logs") ? (
        <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
          <Card>
            <h3 className="font-display text-2xl font-semibold tracking-tightest">Flagged Submission Logs</h3>
            <p className="mt-1 text-xs text-text-secondary">Searchable logs for userId, challengeId, AI probability, paste count, timestamp, and integrity change.</p>

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by user, challenge, or log ID"
              className="mt-4 w-full rounded-xl border border-border bg-bg/60 px-3 py-2 text-xs text-text-primary outline-none"
            />

            <div className="mt-4 space-y-2">
              {filteredLogs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.16, delay: index * 0.03 }}
                  className="rounded-xl border border-border bg-bg/40 p-3 text-xs text-text-secondary"
                >
                  <p>User ID: {log.userId}</p>
                  <p className="mt-1">Challenge ID: {log.challengeId}</p>
                  <p className="mt-1">AI probability: {log.aiProbability}</p>
                  <p className="mt-1">Paste event count: {log.pasteEventCount}</p>
                  <p className="mt-1">Timestamp: {new Date(log.timestamp).toLocaleString()}</p>
                  <p className="mt-1">Integrity changes: {log.integrityDelta}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      ) : null}

      {(activeSection === "overview") ? (
        <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
          <Card>
            <h3 className="font-display text-2xl font-semibold tracking-tightest">Exchange Activity Snapshot</h3>
            <p className="mt-1 text-xs text-text-secondary">Operational visibility into active, completed, and pending exchange sessions.</p>
            <div className="mt-4 space-y-2">
              {skillExchanges.map((item) => (
                <div key={item.id} className="rounded-xl border border-border bg-bg/40 p-3 text-xs text-text-secondary">
                  <p>Exchange ID: {item.id}</p>
                  <p className="mt-1">Skill: {item.skill}</p>
                  <p className="mt-1">Status: {item.status}</p>
                  <p className="mt-1">Baseline verified: {item.baselineVerified ? "Yes" : "No"}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      ) : null}
    </motion.div>
  );
}
