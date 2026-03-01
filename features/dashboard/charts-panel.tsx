"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
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
import { Card } from "@/components/ui/card";

const trend = [
  { name: "W1", skill: 56 },
  { name: "W2", skill: 64 },
  { name: "W3", skill: 73 },
  { name: "W4", skill: 87 }
];

const bars = [
  { name: "Algo", val: 82 },
  { name: "Systems", val: 71 },
  { name: "AI", val: 88 }
];

const radar = [
  { dim: "Logic", val: 91 },
  { dim: "Clarity", val: 76 },
  { dim: "Speed", val: 84 },
  { dim: "Depth", val: 80 }
];

export const ChartsPanel = memo(function ChartsPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Card className="space-y-6">
        <h3 className="text-sm font-semibold">Performance Analytics</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid stroke="#1A1A1A" />
                <XAxis dataKey="name" stroke="#A1A1A1" />
                <YAxis stroke="#A1A1A1" />
                <Tooltip contentStyle={{ background: "#0A0A0A", border: "1px solid #1A1A1A" }} />
                <Line type="monotone" dataKey="skill" stroke="#FFFFFF" strokeWidth={2} dot={false} isAnimationActive />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bars}>
                <CartesianGrid stroke="#1A1A1A" />
                <XAxis dataKey="name" stroke="#A1A1A1" />
                <YAxis stroke="#A1A1A1" />
                <Bar dataKey="val" fill="#777777" radius={[6, 6, 0, 0]} isAnimationActive />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radar}>
              <PolarGrid stroke="#2B2B2B" />
              <PolarAngleAxis dataKey="dim" stroke="#A1A1A1" />
              <Radar dataKey="val" stroke="#FFFFFF" fill="#FFFFFF" fillOpacity={0.12} isAnimationActive />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
});
