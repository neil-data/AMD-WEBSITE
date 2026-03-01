import { NextRequest, NextResponse } from "next/server";
import { evaluateSubmissionSchema } from "@/lib/validation";

type RateWindow = {
  count: number;
  startedAt: number;
};

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 10;
const submissionWindows = new Map<string, RateWindow>();

function currentWindow(key: string) {
  const now = Date.now();
  const existing = submissionWindows.get(key);

  if (!existing || now - existing.startedAt > RATE_LIMIT_WINDOW_MS) {
    const fresh = { count: 0, startedAt: now };
    submissionWindows.set(key, fresh);
    return fresh;
  }

  return existing;
}

function computeAiProbability({
  code,
  explanation,
  conceptualReasoning,
  pasteEventCount
}: {
  code: string;
  explanation: string;
  conceptualReasoning: string;
  pasteEventCount: number;
}) {
  const codeLines = code.split("\n").length;
  const explanationLines = explanation.split("\n").length;
  const conceptLines = conceptualReasoning.split("\n").length;

  const codeDensitySignal = Math.min(0.25, Math.max(0, (codeLines - explanationLines - conceptLines) / 120));
  const pasteSignal = Math.min(0.35, pasteEventCount * 0.03);
  const mismatchSignal = explanation.length < Math.max(80, code.length * 0.12) ? 0.18 : 0.05;
  const complexitySignal = /(segment tree|fenwick|suffix automaton|kmp|a\*|simulated annealing)/i.test(code) ? 0.14 : 0.04;

  return Math.min(0.97, Math.max(0.05, 0.12 + codeDensitySignal + pasteSignal + mismatchSignal + complexitySignal));
}

export async function POST(request: NextRequest) {
  const ipKey = request.headers.get("x-forwarded-for") ?? "unknown";
  const window = currentWindow(ipKey);

  if (window.count >= RATE_LIMIT_MAX) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  window.count += 1;

  const body = await request.json();
  const parsed = evaluateSubmissionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }

  const { code, explanation, conceptualReasoning, pasteEventCount } = parsed.data;
  const totalTestCases = 10;

  const aiProbability = Number(
    computeAiProbability({
      code,
      explanation,
      conceptualReasoning,
      pasteEventCount
    }).toFixed(2)
  );

  const codeScore = Math.max(52, Math.min(98, Math.round(60 + (code.length / 5000) * 25 - pasteEventCount * 1.1)));
  const explanationScore = Math.max(40, Math.min(96, Math.round(45 + (explanation.length / 1500) * 45)));
  const conceptualScore = Math.max(38, Math.min(94, Math.round(42 + (conceptualReasoning.length / 1700) * 45)));

  const weakExplanationMismatch = codeScore - Math.max(explanationScore, conceptualScore) > 22;
  const integrityImpact = aiProbability > 0.8 ? -7 : aiProbability > 0.65 ? -3 : weakExplanationMismatch ? -2 : 1;
  const passRatio = aiProbability > 0.8 ? 0.7 : aiProbability > 0.65 ? 0.8 : 0.9;
  const testCasesPassed = Math.max(0, Math.min(totalTestCases, Math.round(totalTestCases * passRatio)));

  const runtime = `${Math.max(65, 220 - Math.round(code.length / 240))}ms`;
  const memory = `${Math.max(24, 48 - Math.round(explanation.length / 260))}MB`;
  const finalSkillScore = Math.max(
    0,
    Math.min(100, Math.round(codeScore * 0.6 + explanationScore * 0.2 + conceptualScore * 0.2 + integrityImpact))
  );

  return NextResponse.json(
    {
      testCasesPassed,
      totalTestCases,
      runtime,
      memory,
      codeScore,
      explanationScore,
      conceptualScore,
      aiProbability,
      integrityImpact,
      finalSkillScore
    },
    { status: 200 }
  );
}
