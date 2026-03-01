import { z } from "zod";

export const evaluateSubmissionSchema = z.object({
  challengeId: z.string().min(3).max(120),
  language: z.enum(["javascript", "python", "java", "cpp"]),
  code: z.string().min(20).max(20000),
  explanation: z.string().min(20).max(6000),
  conceptualReasoning: z.string().min(20).max(6000),
  pasteEventCount: z.number().int().min(0).max(1000)
});

export type EvaluateSubmissionInput = z.infer<typeof evaluateSubmissionSchema>;
