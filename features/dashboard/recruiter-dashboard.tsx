"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";
import { CountUp } from "@/features/dashboard/count-up";
import { candidateRecords, flaggedSubmissionLogs } from "@/lib/mock-platform-data";

type RecruiterSection = "overview" | "candidates" | "logs";

const RecruiterProfileCharts = dynamic(
  () => import("@/features/dashboard/recruiter-profile-charts").then((mod) => mod.RecruiterProfileCharts),
  { ssr: false, loading: () => <div className="h-56 w-full rounded-xl border border-border skeleton" /> }
);

const pageSize = 3;

export function RecruiterDashboard({ section }: { section?: string }) {
  const activeSection: RecruiterSection = section === "candidates" || section === "logs" ? section : "overview";

  const [selectedCandidateId, setSelectedCandidateId] = useState(candidateRecords[0].id);
  const [query, setQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("all");
  const [aiRiskFilter, setAiRiskFilter] = useState<"all" | "Low" | "Medium" | "High">("all");
  const [scoreFilter, setScoreFilter] = useState(0);
  const [integrityFilter, setIntegrityFilter] = useState(0);
  const [page, setPage] = useState(1);

  const allSkills = useMemo(() => Array.from(new Set(candidateRecords.flatMap((candidate) => candidate.skills))).sort(), []);

  const filteredCandidates = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return candidateRecords.filter((candidate) => {
      const matchesQuery =
        !needle ||
        candidate.candidate.toLowerCase().includes(needle) ||
        candidate.role.toLowerCase().includes(needle);
      const matchesSkill = skillFilter === "all" || candidate.skills.includes(skillFilter);
      const matchesRisk = aiRiskFilter === "all" || candidate.aiRisk === aiRiskFilter;
      const matchesScore = candidate.avgScore >= scoreFilter;
      const matchesIntegrity = candidate.integrityScore >= integrityFilter;
      return matchesQuery && matchesSkill && matchesRisk && matchesScore && matchesIntegrity;
    });
  }, [aiRiskFilter, integrityFilter, query, scoreFilter, skillFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredCandidates.length / pageSize));
  const pagedCandidates = filteredCandidates.slice((page - 1) * pageSize, page * pageSize);

  const selectedCandidate =
    candidateRecords.find((candidate) => candidate.id === selectedCandidateId) ??
    filteredCandidates[0] ??
    candidateRecords[0];

  const radarData = [
    { metric: "Logic", value: selectedCandidate.avgScore },
    { metric: "Speed", value: Math.max(60, selectedCandidate.avgScore - 4) },
    { metric: "Integrity", value: selectedCandidate.integrityScore },
    { metric: "Depth", value: Math.max(62, selectedCandidate.avgScore - 3) },
    { metric: "Clarity", value: Math.max(58, selectedCandidate.avgScore - 7) }
  ];

  const aiTrendData = selectedCandidate.weeklyTrend.map((value, index) => ({
    week: `W${index + 1}`,
    probability: Number((Math.max(0.1, (100 - value) / 100)).toFixed(2))
  }));

  const integrityHistoryData = selectedCandidate.weeklyTrend.map((value, index) => ({
    week: `W${index + 1}`,
    integrity: Math.min(100, Math.max(65, value + (selectedCandidate.integrityScore - 88)))
  }));

  const avgScore = Math.round(candidateRecords.reduce((sum, candidate) => sum + candidate.avgScore, 0) / candidateRecords.length);
  const avgIntegrity = Math.round(candidateRecords.reduce((sum, candidate) => sum + candidate.integrityScore, 0) / candidateRecords.length);
  const lowRiskCount = candidateRecords.filter((candidate) => candidate.aiRisk === "Low").length;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } } }}
      className="space-y-6 p-6"
    >
      <SectionTitle
        title="Recruiter Dashboard"
        subtitle="Search and verify candidates with SkillRank, integrity, AI-risk signals, trend analytics, and trust-backed performance evidence."
      />

      <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="grid gap-3 md:grid-cols-5">
        <Card className="p-4">
          <p className="text-[11px] text-text-secondary">Candidate Pool</p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-tightest"><CountUp value={candidateRecords.length} /></p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] text-text-secondary">Avg SkillScore</p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-tightest"><CountUp value={avgScore} suffix="%" /></p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] text-text-secondary">Avg Integrity</p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-tightest"><CountUp value={avgIntegrity} suffix="%" /></p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] text-text-secondary">Low AI Risk</p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-tightest"><CountUp value={lowRiskCount} /></p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] text-text-secondary">Flagged Logs</p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-tightest"><CountUp value={flaggedSubmissionLogs.length} /></p>
        </Card>
      </motion.div>

      {(activeSection === "overview" || activeSection === "candidates") ? (
        <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <h3 className="font-display text-2xl font-semibold tracking-tightest">Candidate Search</h3>
            <p className="mt-1 text-xs text-text-secondary">Filter by skill, SkillRank signals, integrity, and AI risk. Raw code is hidden by default for recruiter safety.</p>

            <div className="mt-4 grid gap-2 md:grid-cols-2">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search candidate or role"
                className="rounded-xl border border-border bg-bg/60 px-3 py-2 text-xs text-text-primary outline-none"
              />
              <select
                value={skillFilter}
                onChange={(event) => setSkillFilter(event.target.value)}
                className="rounded-xl border border-border bg-bg/60 px-3 py-2 text-xs text-text-secondary outline-none"
              >
                <option value="all">All skills</option>
                {allSkills.map((skill) => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
              <select
                value={aiRiskFilter}
                onChange={(event) => setAiRiskFilter(event.target.value as "all" | "Low" | "Medium" | "High")}
                className="rounded-xl border border-border bg-bg/60 px-3 py-2 text-xs text-text-secondary outline-none"
              >
                <option value="all">All AI risk levels</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <div className="rounded-xl border border-border bg-bg/60 px-3 py-2 text-xs text-text-secondary">Min score: {scoreFilter}%</div>
              <input
                type="range"
                min={0}
                max={100}
                value={scoreFilter}
                onChange={(event) => setScoreFilter(Number(event.target.value))}
                className="accent-white"
              />
              <div className="rounded-xl border border-border bg-bg/60 px-3 py-2 text-xs text-text-secondary">Min integrity: {integrityFilter}%</div>
              <input
                type="range"
                min={0}
                max={100}
                value={integrityFilter}
                onChange={(event) => setIntegrityFilter(Number(event.target.value))}
                className="accent-white"
              />
            </div>

            <div className="mt-4 space-y-2">
              {pagedCandidates.map((candidate, index) => (
                <motion.button
                  key={candidate.id}
                  type="button"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.16, delay: index * 0.04 }}
                  className={`w-full rounded-xl border p-3 text-left ${selectedCandidate.id === candidate.id ? "border-white/30 bg-white/5" : "border-border bg-bg/40 hover:border-white/20"}`}
                  onClick={() => setSelectedCandidateId(candidate.id)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-text-primary">{candidate.candidate}</p>
                    <p className="text-[11px] text-text-secondary">{candidate.aiRisk} AI risk</p>
                  </div>
                  <p className="mt-1 text-xs text-text-secondary">
                    {candidate.role} • SkillScore {candidate.avgScore}% • Integrity {candidate.integrityScore}% • Percentile {candidate.percentile}%
                  </p>
                </motion.button>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 text-xs text-text-secondary">
              <button
                type="button"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                className="rounded-lg border border-border px-2 py-1"
              >
                Prev
              </button>
              <span>{page}/{totalPages}</span>
              <button
                type="button"
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                className="rounded-lg border border-border px-2 py-1"
              >
                Next
              </button>
            </div>
          </Card>

          <Card>
            <h3 className="font-display text-2xl font-semibold tracking-tightest">Candidate Profile</h3>
            <p className="mt-1 text-xs text-text-secondary">Verified profile view for recruiters. Raw source code is hidden unless explicit access policy is approved.</p>

            <div className="mt-4 grid gap-2 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-bg/40 p-3">
                <p className="text-xs text-text-secondary">Name</p>
                <p className="mt-1 text-sm text-text-primary">{selectedCandidate.candidate}</p>
              </div>
              <div className="rounded-xl border border-border bg-bg/40 p-3">
                <p className="text-xs text-text-secondary">Role</p>
                <p className="mt-1 text-sm text-text-primary">{selectedCandidate.role}</p>
              </div>
              <div className="rounded-xl border border-border bg-bg/40 p-3">
                <p className="text-xs text-text-secondary">Percentile</p>
                <p className="mt-1 text-sm text-text-primary">{selectedCandidate.percentile}%</p>
              </div>
              <div className="rounded-xl border border-border bg-bg/40 p-3">
                <p className="text-xs text-text-secondary">Recent challenges solved</p>
                <p className="mt-1 text-sm text-text-primary">{selectedCandidate.solved}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-border bg-bg/40 p-3">
              <p className="text-xs text-text-secondary">Verified badges</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedCandidate.verifiedBadges.map((badge) => (
                  <span key={badge} className="rounded-md border border-white/20 bg-white/5 px-2 py-1 text-[11px] text-text-primary">{badge}</span>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-border bg-bg/40 p-3">
              <p className="text-xs text-text-secondary">Teaching contributions</p>
              <p className="mt-1 text-sm text-text-primary">{Math.round(selectedCandidate.solved * 1.8)} verified points</p>
            </div>

            <div className="mt-4">
              <RecruiterProfileCharts
                radarData={radarData}
                aiTrendData={aiTrendData}
                integrityHistoryData={integrityHistoryData}
              />
            </div>
          </Card>
        </motion.div>
      ) : null}

      {(activeSection === "overview" || activeSection === "logs") ? (
        <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
          <Card>
            <h3 className="font-display text-2xl font-semibold tracking-tightest">Flagged Submission Logs</h3>
            <p className="mt-1 text-xs text-text-secondary">User ID, challenge ID, AI probability, paste event count, timestamp, and integrity changes.</p>
            <div className="mt-4 space-y-2">
              {flaggedSubmissionLogs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.16, delay: index * 0.03 }}
                  className="grid gap-1 rounded-xl border border-border bg-bg/40 p-3 text-xs text-text-secondary md:grid-cols-3"
                >
                  <p>User ID: {log.userId}</p>
                  <p>Challenge ID: {log.challengeId}</p>
                  <p>AI probability: {log.aiProbability}</p>
                  <p>Paste events: {log.pasteEventCount}</p>
                  <p>Timestamp: {new Date(log.timestamp).toLocaleString()}</p>
                  <p>Integrity change: {log.integrityDelta}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      ) : null}
    </motion.div>
  );
}
