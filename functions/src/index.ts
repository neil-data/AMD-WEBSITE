import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { z } from "zod";

initializeApp();

const db = getFirestore();

const evaluateSchema = z.object({
  submissionId: z.string().min(3),
  aiProbability: z.number().min(0).max(1),
  codeScore: z.number().min(0).max(100),
  explanationScore: z.number().min(0).max(100),
  conceptualScore: z.number().min(0).max(100),
  runtime: z.string().min(2),
  memory: z.string().min(2),
  testCasesPassed: z.number().int().min(0),
  totalTestCases: z.number().int().min(1)
});

function integrityDelta(aiProbability: number, pasteEventCount: number, scoreGap: number) {
  if (aiProbability > 0.8) {
    return -7;
  }

  if (aiProbability > 0.65 || pasteEventCount > 8 || scoreGap > 25) {
    return -3;
  }

  return 1;
}

async function refreshLeaderboard(userId: string, weekKey: string) {
  const scoreDoc = await db.collection("scores").doc(userId).get();
  if (!scoreDoc.exists) {
    return;
  }

  const scoreData = scoreDoc.data() ?? {};

  await db.collection("leaderboard").doc(`${weekKey}-${userId}`).set(
    {
      userId,
      weekKey,
      skill: scoreData.primarySkill ?? "General",
      skillRankScore: scoreData.skillRankScore ?? 0,
      integrityScore: scoreData.integrityScore ?? 0,
      contributionScore: scoreData.contributionScore ?? 0,
      weeklyPoints: scoreData.weeklyPoints ?? 0,
      createdAt: new Date().toISOString()
    },
    { merge: true }
  );
}

export const onSubmissionCreated = functions.firestore.document("submissions/{submissionId}").onCreate(async (snapshot: functions.firestore.QueryDocumentSnapshot) => {
  await snapshot.ref.set(
    {
      status: "queued",
      queuedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );
});

export const applyEvaluation = functions.https.onCall(async (data: unknown) => {
  const parsed = evaluateSchema.safeParse(data);
  if (!parsed.success) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid evaluation payload");
  }

  const {
    submissionId,
    aiProbability,
    codeScore,
    explanationScore,
    conceptualScore,
    runtime,
    memory,
    testCasesPassed,
    totalTestCases
  } = parsed.data;

  const submissionRef = db.collection("submissions").doc(submissionId);
  const submissionDoc = await submissionRef.get();
  if (!submissionDoc.exists) {
    throw new functions.https.HttpsError("not-found", "Submission not found");
  }

  const submission = submissionDoc.data();
  const userId = submission?.userId as string | undefined;
  if (!userId) {
    throw new functions.https.HttpsError("failed-precondition", "Missing user id in submission");
  }

  const scoreGap = codeScore - Math.max(explanationScore, conceptualScore);
  const computedIntegrityDelta = integrityDelta(aiProbability, submission?.pasteEventCount ?? 0, scoreGap);
  const finalSkillScore = Math.round(codeScore * 0.6 + explanationScore * 0.2 + conceptualScore * 0.2 + computedIntegrityDelta);
  const status = aiProbability > 0.8 ? "flagged" : "verified";

  await submissionRef.set(
    {
      aiProbability,
      codeScore,
      explanationScore,
      conceptualScore,
      runtime,
      memory,
      testCasesPassed,
      totalTestCases,
      integrityImpact: computedIntegrityDelta,
      finalSkillScore,
      status,
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );

  const scoreRef = db.collection("scores").doc(userId);
  await scoreRef.set(
    {
      skillRankScore: FieldValue.increment(Math.max(2, Math.round(finalSkillScore / 8))),
      integrityScore: FieldValue.increment(computedIntegrityDelta),
      contributionScore: FieldValue.increment(0),
      updatedAt: new Date().toISOString(),
      aiRiskLevel: aiProbability > 0.8 ? "High" : aiProbability > 0.65 ? "Medium" : "Low"
    },
    { merge: true }
  );

  const weekKey = new Date().toISOString().slice(0, 10);
  await refreshLeaderboard(userId, weekKey);

  await db.collection("logs").add({
    userId,
    challengeId: submission?.challengeId,
    aiProbability,
    pasteEventCount: submission?.pasteEventCount ?? 0,
    timestamp: new Date().toISOString(),
    integrityChanges: computedIntegrityDelta,
    reason: status === "flagged" ? "High AI probability threshold exceeded" : "Submission verified"
  });

  return { submissionId, finalSkillScore, integrityImpact: computedIntegrityDelta, status };
});

export const onExchangeUpdated = functions.firestore.document("skillExchanges/{exchangeId}").onUpdate(async (change: functions.Change<functions.firestore.QueryDocumentSnapshot>) => {
  const before = change.before.data();
  const after = change.after.data();

  if (!before || !after || before.status === after.status) {
    return;
  }

  const teacherId = after.teacherId as string | undefined;
  if (!teacherId) {
    return;
  }

  const scoreRef = db.collection("scores").doc(teacherId);

  if (after.status === "completed") {
    await scoreRef.set(
      {
        contributionScore: FieldValue.increment(8),
        integrityScore: FieldValue.increment(4),
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  }

  if (after.status === "withdrawn") {
    await scoreRef.set(
      {
        contributionScore: FieldValue.increment(-10),
        integrityScore: FieldValue.increment(-15),
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  }

  const weekKey = new Date().toISOString().slice(0, 10);
  await refreshLeaderboard(teacherId, weekKey);
});
