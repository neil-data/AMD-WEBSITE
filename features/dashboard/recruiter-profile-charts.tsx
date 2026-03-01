"use client";

import { motion } from "framer-motion";
import {
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type RecruiterProfileChartsProps = {
  radarData: Array<{ metric: string; value: number }>;
  aiTrendData: Array<{ week: string; probability: number }>;
  integrityHistoryData: Array<{ week: string; integrity: number }>;
};

export function RecruiterProfileCharts({ radarData, aiTrendData, integrityHistoryData }: RecruiterProfileChartsProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }} className="grid gap-4 lg:grid-cols-3">
      <div className="h-56 rounded-xl border border-border bg-bg/40 p-3">
        <p className="mb-2 text-xs text-text-secondary">Skill Graph (Radar)</p>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="#2B2B2B" />
            <PolarAngleAxis dataKey="metric" stroke="#A1A1A1" />
            <Radar dataKey="value" stroke="#FFFFFF" fill="#FFFFFF" fillOpacity={0.12} isAnimationActive />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="h-56 rounded-xl border border-border bg-bg/40 p-3">
        <p className="mb-2 text-xs text-text-secondary">AI Probability Trend</p>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={aiTrendData}>
            <CartesianGrid stroke="#1A1A1A" />
            <XAxis dataKey="week" stroke="#A1A1A1" />
            <YAxis stroke="#A1A1A1" domain={[0, 1]} />
            <Tooltip contentStyle={{ background: "#0A0A0A", border: "1px solid #1A1A1A" }} />
            <Line dataKey="probability" stroke="#FFFFFF" strokeWidth={2} dot={false} isAnimationActive />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="h-56 rounded-xl border border-border bg-bg/40 p-3">
        <p className="mb-2 text-xs text-text-secondary">Integrity History</p>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={integrityHistoryData}>
            <CartesianGrid stroke="#1A1A1A" />
            <XAxis dataKey="week" stroke="#A1A1A1" />
            <YAxis stroke="#A1A1A1" domain={[60, 100]} />
            <Line dataKey="integrity" stroke="#FFFFFF" strokeWidth={2} dot={false} isAnimationActive />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
