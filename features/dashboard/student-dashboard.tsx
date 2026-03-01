"use client";

import dynamic from "next/dynamic";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";
import { CountUp } from "@/features/dashboard/count-up";
import { IntegrityRing } from "@/features/dashboard/integrity-ring";
import { useToast } from "@/hooks/use-toast";
import { challengeBank, leaderboardEntries, skillExchanges, type LeaderboardEntry, type SkillExchangeItem } from "@/lib/mock-platform-data";

type StudentSection = "overview" | "challenges" | "exchange" | "leaderboard";
type Language = "javascript" | "python" | "java" | "cpp";

type EvaluationResult = {
  testCasesPassed: number;
  totalTestCases: number;
  runtime: string;
  memory: string;
  codeScore: number;
  explanationScore: number;
  conceptualScore: number;
  aiProbability: number;
  integrityImpact: number;
  finalSkillScore: number;
};

type ActivityItem = {
  id: string;
  message: string;
  createdAt: string;
};

type SubmissionHistoryItem = {
  id: string;
  challengeId: string;
  challengeTitle: string;
  runtime: string;
  memory: string;
  testCasesPassed: number;
  totalTestCases: number;
  finalSkillScore: number;
  aiProbability: number;
  createdAt: string;
};

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="h-full w-full skeleton" />
});

const starterCodeByLanguage: Record<Language, string> = {
  javascript: "function solve(input) {\n  // Write your solution\n  return input;\n}",
  python: "def solve(input_data):\n    # Write your solution\n    return input_data",
  java: "class Solution {\n  public Object solve(Object input) {\n    // Write your solution\n    return input;\n  }\n}",
  cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nint solve(int input) {\n  // Write your solution\n  return input;\n}"
};

const aiThreshold = 0.65;
const pageSize = 5;

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function StudentDashboard({ section }: { section?: string }) {
  const activeSection: StudentSection =
    section === "challenges" || section === "exchange" || section === "leaderboard" ? section : "overview";

  const { push } = useToast();
  const [selectedChallengeId, setSelectedChallengeId] = useState(challengeBank[0].id);
  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState(starterCodeByLanguage.javascript);
  const [explanation, setExplanation] = useState("");
  const [conceptualReasoning, setConceptualReasoning] = useState("");
  const [pasteEvents, setPasteEvents] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [integrityScore, setIntegrityScore] = useState(92);
  const [contributionScore, setContributionScore] = useState(78);
  const [skillRankScore, setSkillRankScore] = useState(1324);
  const [aiRiskLevel, setAiRiskLevel] = useState<"Low" | "Medium" | "High">("Low");
  const [completedChallenges, setCompletedChallenges] = useState<Record<string, boolean>>({});
  const [activity, setActivity] = useState<ActivityItem[]>([
    { id: "a-1", message: "Solved Merge Intervals with 11/12 test cases", createdAt: "09:45" },
    { id: "a-2", message: "Completed verified teaching session: React Performance", createdAt: "09:10" },
    { id: "a-3", message: "Integrity maintained above 90 for 14 days", createdAt: "08:40" }
  ]);
  const [exchangeItems, setExchangeItems] = useState<SkillExchangeItem[]>(skillExchanges);
  const [submissionHistory, setSubmissionHistory] = useState<SubmissionHistoryItem[]>([]);

  const [leaderboardSearch, setLeaderboardSearch] = useState("");
  const [leaderboardSkillFilter, setLeaderboardSkillFilter] = useState("all");
  const [leaderboardMetric, setLeaderboardMetric] = useState<"skillRank" | "integrity" | "contributions" | "weeklyPoints">("skillRank");
  const [leaderboardPage, setLeaderboardPage] = useState(1);

  const selectedChallenge = useMemo(
    () => challengeBank.find((challenge) => challenge.id === selectedChallengeId) ?? challengeBank[0],
    [selectedChallengeId]
  );
  const latestSubmission = submissionHistory[0] ?? null;

  const draftStorageKey = `skillrank:draft:${selectedChallenge.id}:${language}`;

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(draftStorageKey) : null;
    setCode(saved ?? starterCodeByLanguage[language]);
  }, [draftStorageKey, language]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(draftStorageKey, code);
  }, [code, draftStorageKey]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const raw = window.localStorage.getItem("skillrank:submission-history");
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as SubmissionHistoryItem[];
      if (Array.isArray(parsed)) {
        setSubmissionHistory(parsed);
      }
    } catch {
      setSubmissionHistory([]);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem("skillrank:submission-history", JSON.stringify(submissionHistory));
  }, [submissionHistory]);

  const solvedCount = useMemo(() => Object.values(completedChallenges).filter(Boolean).length, [completedChallenges]);
  const percentile = useMemo(() => Math.min(99, Math.max(65, Math.round(skillRankScore / 14.8))), [skillRankScore]);
  const completionRate = useMemo(() => Math.round((solvedCount / challengeBank.length) * 100), [solvedCount]);

  const challengeStatus = completedChallenges[selectedChallenge.id] ? "Solved" : "Pending";

  const addActivity = (message: string) => {
    setActivity((previous) => [{ id: `${Date.now()}`, message, createdAt: nowTime() }, ...previous].slice(0, 10));
  };

  async function onSubmitChallenge(event: FormEvent) {
    event.preventDefault();

    if (!code.trim() || !explanation.trim() || !conceptualReasoning.trim()) {
      push("Code, explanation, and conceptual reasoning are mandatory", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: selectedChallenge.id,
          language,
          code,
          explanation,
          conceptualReasoning,
          pasteEventCount: pasteEvents
        })
      });

      if (!response.ok) {
        push("Submission rejected. Please review input and retry.", "error");
        setIsSubmitting(false);
        return;
      }

      const data = (await response.json()) as EvaluationResult;
      setEvaluationResult(data);
      setCompletedChallenges((previous) => ({ ...previous, [selectedChallenge.id]: data.testCasesPassed >= data.totalTestCases - 2 }));
      setSubmissionHistory((previous) => [
        {
          id: `${Date.now()}-${selectedChallenge.id}`,
          challengeId: selectedChallenge.id,
          challengeTitle: selectedChallenge.title,
          runtime: data.runtime,
          memory: data.memory,
          testCasesPassed: data.testCasesPassed,
          totalTestCases: data.totalTestCases,
          finalSkillScore: data.finalSkillScore,
          aiProbability: data.aiProbability,
          createdAt: new Date().toISOString()
        },
        ...previous
      ].slice(0, 20));

      setSkillRankScore((previous) => previous + Math.max(6, Math.round(data.finalSkillScore / 6)));
      setIntegrityScore((previous) => Math.max(0, Math.min(100, previous + data.integrityImpact)));

      if (data.aiProbability > 0.8) {
        setAiRiskLevel("High");
        push("High AI probability detected. Submission flagged for review.", "error");
        addActivity(`Flagged ${selectedChallenge.title} due to AI probability ${(data.aiProbability * 100).toFixed(0)}%`);
      } else if (data.aiProbability > aiThreshold) {
        setAiRiskLevel("Medium");
        push("AI risk elevated. Integrity impact applied.", "info");
      } else {
        setAiRiskLevel("Low");
        push("Submission verified successfully", "success");
      }

      addActivity(`Submitted ${selectedChallenge.title} (${data.testCasesPassed}/${data.totalTestCases}) • ${data.runtime} • Score ${data.finalSkillScore}`);
    } catch {
      push("Network issue while submitting challenge", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  const exchangeCounts = useMemo(
    () => ({
      active: exchangeItems.filter((item) => item.status === "active").length,
      completed: exchangeItems.filter((item) => item.status === "completed").length,
      pending: exchangeItems.filter((item) => item.status === "pending").length
    }),
    [exchangeItems]
  );

  const updateExchange = (id: string, action: "verify" | "accept" | "complete" | "withdraw") => {
    setExchangeItems((previous) =>
      previous.map((item) => {
        if (item.id !== id) {
          return item;
        }

        if (action === "verify") {
          addActivity(`Baseline verification passed for ${item.skill}`);
          return { ...item, baselineVerified: true };
        }

        if (action === "accept" && item.status === "pending" && item.baselineVerified) {
          addActivity(`Accepted skill exchange request for ${item.skill}`);
          return { ...item, status: "active" };
        }

        if (action === "complete" && item.status === "active") {
          setContributionScore((score) => score + 8);
          setIntegrityScore((score) => Math.min(100, score + 4));
          addActivity(`Completed exchange session for ${item.skill}`);
          return { ...item, status: "completed", feedbackScore: 5 };
        }

        if (action === "withdraw" && (item.status === "active" || item.status === "pending")) {
          setContributionScore((score) => Math.max(0, score - 10));
          setIntegrityScore((score) => Math.max(0, score - 15));
          addActivity(`Withdrew from ${item.skill} exchange (-15 integrity, -10 contribution)`);
          return { ...item, status: "withdrawn" };
        }

        return item;
      })
    );
  };

  const skills = useMemo(() => Array.from(new Set(leaderboardEntries.map((entry) => entry.skill))).sort(), []);

  const filteredLeaderboard = useMemo(() => {
    const searched = leaderboardEntries.filter((entry) => {
      const matchSkill = leaderboardSkillFilter === "all" || entry.skill === leaderboardSkillFilter;
      const needle = leaderboardSearch.trim().toLowerCase();
      const matchSearch = !needle || entry.name.toLowerCase().includes(needle) || entry.userId.toLowerCase().includes(needle);
      return matchSkill && matchSearch;
    });

    const sorted = [...searched].sort((a, b) => b[leaderboardMetric] - a[leaderboardMetric]);
    return sorted.map((item, index) => ({ ...item, rank: index + 1 }));
  }, [leaderboardMetric, leaderboardSearch, leaderboardSkillFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLeaderboard.length / pageSize));
  const pagedLeaderboard = filteredLeaderboard.slice((leaderboardPage - 1) * pageSize, leaderboardPage * pageSize);

  useEffect(() => {
    if (leaderboardPage > totalPages) {
      setLeaderboardPage(1);
    }
  }, [leaderboardPage, totalPages]);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } } }}
      className="space-y-4 p-4 md:space-y-6 md:p-6"
    >
      <SectionTitle
        title="Student Dashboard"
        subtitle="Performance-verified coding challenges with mandatory reasoning, AI misuse detection, and integrity-linked growth."
      />

      <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        <Card className="p-4">
          <p className="text-[11px] text-text-secondary">SkillRank Score</p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-tightest"><CountUp value={skillRankScore} /></p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] text-text-secondary">Contribution Score</p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-tightest"><CountUp value={contributionScore} /></p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] text-text-secondary">Percentile Ranking</p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-tightest"><CountUp value={percentile} suffix="%" /></p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] text-text-secondary">Solved</p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-tightest"><CountUp value={solvedCount} />/{challengeBank.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] text-text-secondary">Completion</p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-tightest"><CountUp value={completionRate} suffix="%" /></p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] text-text-secondary">AI Risk Level</p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-tightest">{aiRiskLevel}</p>
        </Card>
      </motion.div>

      {latestSubmission ? (
        <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
          <Card className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-text-secondary">Latest submission</p>
              <p className="text-xs text-text-secondary">{new Date(latestSubmission.createdAt).toLocaleString()}</p>
            </div>
            <p className="mt-2 text-sm text-text-primary">{latestSubmission.challengeTitle}</p>
            <p className="mt-1 text-xs text-text-secondary">
              Runtime {latestSubmission.runtime} • Memory {latestSubmission.memory} • Passed {latestSubmission.testCasesPassed}/{latestSubmission.totalTestCases} • Final Score {latestSubmission.finalSkillScore}
            </p>
          </Card>
        </motion.div>
      ) : null}

      {(activeSection === "overview" || activeSection === "challenges") ? (
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <h3 className="font-display text-2xl font-semibold tracking-tightest">50 LeetCode-Style Challenges</h3>
            <p className="mt-1 text-xs text-text-secondary">Title, difficulty, statement, examples, constraints, and notes in standard coding-interview format.</p>
            <div className="mt-4 max-h-[560px] space-y-2 overflow-auto pr-1">
              {challengeBank.map((challenge, index) => {
                const active = challenge.id === selectedChallenge.id;
                return (
                  <motion.button
                    key={challenge.id}
                    type="button"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, delay: index * 0.01 }}
                    className={`w-full rounded-xl border p-3 text-left ${active ? "border-white/30 bg-white/5" : "border-border bg-bg/40 hover:border-white/15"}`}
                    onClick={() => {
                      setSelectedChallengeId(challenge.id);
                      setEvaluationResult(null);
                      setPasteEvents(0);
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-text-primary">{challenge.title}</p>
                      <p className="text-[10px] text-text-secondary">{completedChallenges[challenge.id] ? "Solved" : "Pending"}</p>
                    </div>
                    <p className="mt-1 text-[11px] text-text-secondary">{challenge.difficulty} • {challenge.topic} • {challenge.points} points</p>
                  </motion.button>
                );
              })}
            </div>
          </Card>

          <Card>
            <form onSubmit={onSubmitChallenge} className="space-y-4" onPaste={() => setPasteEvents((count) => count + 1)}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-2xl font-semibold tracking-tightest">{selectedChallenge.title}</h3>
                  <p className="mt-1 text-xs text-text-secondary">Difficulty: {selectedChallenge.difficulty} • Topic: {selectedChallenge.topic} • Status: {challengeStatus}</p>
                </div>
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value as Language)}
                  className="rounded-lg border border-border bg-bg/60 px-3 py-2 text-xs text-text-secondary outline-none"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-text-primary">Problem Statement</p>
                <p className="text-sm text-text-secondary">{selectedChallenge.statement}</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-text-primary">Example 1</p>
                <div className="rounded-xl border border-border bg-bg/40 p-3 text-xs text-text-secondary">
                  <p>Input: {selectedChallenge.examples[0].input}</p>
                  <p className="mt-1">Output: {selectedChallenge.examples[0].output}</p>
                  <p className="mt-1">Explanation: {selectedChallenge.examples[0].explanation}</p>
                </div>
                <p className="text-xs font-semibold text-text-primary">Example 2</p>
                <div className="rounded-xl border border-border bg-bg/40 p-3 text-xs text-text-secondary">
                  <p>Input: {selectedChallenge.examples[1].input}</p>
                  <p className="mt-1">Output: {selectedChallenge.examples[1].output}</p>
                  <p className="mt-1">Explanation: {selectedChallenge.examples[1].explanation}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-text-primary">Constraints</p>
                {selectedChallenge.constraints.map((constraint) => (
                  <p key={constraint} className="text-xs text-text-secondary">• {constraint}</p>
                ))}
              </div>

              {selectedChallenge.notes?.length ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-text-primary">Notes</p>
                  {selectedChallenge.notes.map((note) => (
                    <p key={note} className="text-xs text-text-secondary">• {note}</p>
                  ))}
                </div>
              ) : null}

              <div className="h-64 overflow-hidden rounded-xl border border-border">
                <MonacoEditor
                  height="100%"
                  language={language === "cpp" ? "cpp" : language}
                  value={code}
                  onChange={(value) => setCode(value ?? "")}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    smoothScrolling: true,
                    automaticLayout: true,
                    scrollBeyondLastLine: false
                  }}
                />
              </div>

              <textarea
                value={explanation}
                onChange={(event) => setExplanation(event.target.value)}
                placeholder="Mandatory: Explain your implementation and key decisions"
                className="h-24 w-full rounded-xl border border-border bg-bg/60 px-3 py-2 text-xs text-text-primary outline-none"
              />
              <textarea
                value={conceptualReasoning}
                onChange={(event) => setConceptualReasoning(event.target.value)}
                placeholder="Mandatory: Describe conceptual reasoning and complexity analysis"
                className="h-24 w-full rounded-xl border border-border bg-bg/60 px-3 py-2 text-xs text-text-primary outline-none"
              />

              <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-bg/40 p-3 text-xs text-text-secondary">
                <p>Paste events tracked: {pasteEvents}</p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg border border-white/25 bg-white/5 px-3 py-2 text-xs text-text-primary disabled:opacity-60"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>

              {evaluationResult ? (
                <div className="rounded-xl border border-border bg-bg/40 p-3 text-xs text-text-secondary">
                  <p className="mb-2 text-text-primary">Submission Result</p>
                  <div className="space-y-1">
                    <p>Result: {evaluationResult.testCasesPassed}/{evaluationResult.totalTestCases} test cases passed</p>
                    <p>Runtime: {evaluationResult.runtime}</p>
                    <p>Memory: {evaluationResult.memory}</p>
                    <p>Code Score: {evaluationResult.codeScore}</p>
                    <p>Explanation Score: {evaluationResult.explanationScore}</p>
                    <p>Conceptual Score: {evaluationResult.conceptualScore}</p>
                    <p>AI Probability: {evaluationResult.aiProbability}</p>
                    <p>Integrity Impact: {evaluationResult.integrityImpact}</p>
                    <p>Final Skill Score: {evaluationResult.finalSkillScore}</p>
                  </div>
                  {evaluationResult.aiProbability > aiThreshold ? (
                    <p className="mt-2 text-text-primary">Warning: AI probability is above threshold and integrity impact has been applied.</p>
                  ) : null}
                </div>
              ) : null}
            </form>
          </Card>
        </motion.div>
      ) : null}

      {(activeSection === "overview") ? (
        <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <IntegrityRing score={integrityScore} />
          <Card>
            <h3 className="font-display text-2xl font-semibold tracking-tightest">Recent Activity</h3>
            <div className="mt-4 space-y-2">
              {activity.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15, delay: index * 0.03 }}
                  className="rounded-xl border border-border bg-bg/40 p-3"
                >
                  <p className="text-sm text-text-primary">{item.message}</p>
                  <p className="mt-1 text-[11px] text-text-secondary">{item.createdAt}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      ) : null}

      {(activeSection === "overview" || activeSection === "challenges") && submissionHistory.length > 0 ? (
        <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
          <Card>
            <h3 className="font-display text-2xl font-semibold tracking-tightest">Submission History</h3>
            <p className="mt-1 text-xs text-text-secondary">Each submit stores runtime, pass result, memory, and final score in your dashboard.</p>
            <div className="mt-4 space-y-2">
              {submissionHistory.slice(0, 8).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: index * 0.03 }}
                  className="rounded-xl border border-border bg-bg/40 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-text-primary">{item.challengeTitle}</p>
                    <p className="text-[11px] text-text-secondary">{new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                  <p className="mt-1 text-xs text-text-secondary">
                    Passed {item.testCasesPassed}/{item.totalTestCases} • Runtime {item.runtime} • Memory {item.memory} • Final Score {item.finalSkillScore} • AI {item.aiProbability}
                  </p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      ) : null}

      {(activeSection === "overview" || activeSection === "exchange") ? (
        <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
          <Card>
            <h3 className="font-display text-2xl font-semibold tracking-tightest">Skill Exchange System</h3>
            <p className="mt-1 text-xs text-text-secondary">Offer skills, request mentorship, verify baseline, complete sessions, and update integrity/contribution automatically.</p>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-border bg-bg/40 p-3 text-xs text-text-secondary">Active exchanges: <span className="text-text-primary">{exchangeCounts.active}</span></div>
              <div className="rounded-xl border border-border bg-bg/40 p-3 text-xs text-text-secondary">Completed exchanges: <span className="text-text-primary">{exchangeCounts.completed}</span></div>
              <div className="rounded-xl border border-border bg-bg/40 p-3 text-xs text-text-secondary">Pending requests: <span className="text-text-primary">{exchangeCounts.pending}</span></div>
            </div>

            <div className="mt-4 space-y-3">
              {exchangeItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.16, delay: index * 0.04 }}
                  className="rounded-xl border border-border bg-bg/40 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm text-text-primary">{item.skill}</p>
                      <p className="text-xs text-text-secondary">Status: {item.status} • Baseline: {item.baselineVerified ? "Verified" : "Pending"}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => updateExchange(item.id, "verify")}
                        className="rounded-md border border-border px-2 py-1 text-[10px] text-text-secondary hover:text-text-primary"
                      >
                        Verify Baseline
                      </button>
                      <button
                        type="button"
                        onClick={() => updateExchange(item.id, "accept")}
                        className="rounded-md border border-border px-2 py-1 text-[10px] text-text-secondary hover:text-text-primary"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => updateExchange(item.id, "complete")}
                        className="rounded-md border border-white/25 bg-white/5 px-2 py-1 text-[10px]"
                      >
                        Complete Session
                      </button>
                      <button
                        type="button"
                        onClick={() => updateExchange(item.id, "withdraw")}
                        className="rounded-md border border-border px-2 py-1 text-[10px] text-text-secondary hover:text-text-primary"
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      ) : null}

      {(activeSection === "overview" || activeSection === "leaderboard") ? (
        <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
          <Card>
            <h3 className="font-display text-2xl font-semibold tracking-tightest">Leaderboard</h3>
            <p className="mt-1 text-xs text-text-secondary">Top SkillRank, highest integrity, most contributions, and weekly rankings with search, skill filter, and pagination.</p>

            <div className="mt-4 grid gap-2 md:grid-cols-4">
              <input
                value={leaderboardSearch}
                onChange={(event) => setLeaderboardSearch(event.target.value)}
                placeholder="Search candidate"
                className="rounded-xl border border-border bg-bg/60 px-3 py-2 text-xs text-text-primary outline-none"
              />
              <select
                value={leaderboardSkillFilter}
                onChange={(event) => setLeaderboardSkillFilter(event.target.value)}
                className="rounded-xl border border-border bg-bg/60 px-3 py-2 text-xs text-text-secondary outline-none"
              >
                <option value="all">All skills</option>
                {skills.map((skill) => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
              <select
                value={leaderboardMetric}
                onChange={(event) => setLeaderboardMetric(event.target.value as "skillRank" | "integrity" | "contributions" | "weeklyPoints")}
                className="rounded-xl border border-border bg-bg/60 px-3 py-2 text-xs text-text-secondary outline-none"
              >
                <option value="skillRank">Top SkillRank</option>
                <option value="integrity">Highest Integrity</option>
                <option value="contributions">Most Contributions</option>
                <option value="weeklyPoints">Weekly Rankings</option>
              </select>
              <div className="flex items-center justify-end gap-2 text-xs text-text-secondary">
                <button
                  type="button"
                  onClick={() => setLeaderboardPage((page) => Math.max(1, page - 1))}
                  className="rounded-lg border border-border px-2 py-1"
                >
                  Prev
                </button>
                <span>{leaderboardPage}/{totalPages}</span>
                <button
                  type="button"
                  onClick={() => setLeaderboardPage((page) => Math.min(totalPages, page + 1))}
                  className="rounded-lg border border-border px-2 py-1"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {pagedLeaderboard.map((entry, index) => (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: index * 0.03 }}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border border-border bg-bg/40 p-3"
                >
                  <p className="text-xs text-text-secondary">#{entry.rank}</p>
                  <div>
                    <p className="text-sm text-text-primary">{entry.name}</p>
                    <p className="text-[11px] text-text-secondary">{entry.skill} • Integrity {entry.integrity}% • Contributions {entry.contributions}</p>
                  </div>
                  <p className="text-xs text-text-secondary">
                    {leaderboardMetric === "skillRank"
                      ? `${entry.skillRank} pts`
                      : leaderboardMetric === "integrity"
                        ? `${entry.integrity}%`
                        : leaderboardMetric === "contributions"
                          ? `${entry.contributions}`
                          : `${entry.weeklyPoints} weekly`}
                  </p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      ) : null}
    </motion.div>
  );
}
