# Firestore Schema

Production collections for SkillRank AI.

## users/{userId}

- displayName: string
- email: string
- role: "student" | "recruiter" | "admin"
- skillRankScore: number
- integrityScore: number
- contributionScore: number
- percentile: number
- aiRiskLevel: "Low" | "Medium" | "High"
- badges: string[]
- completedChallenges: string[]
- exchangeHistory: string[]
- createdAt: string
- updatedAt: string

## challenges/{challengeId}

- title: string
- difficulty: "Easy" | "Medium" | "Hard"
- topic: string
- statement: string
- examples: { input: string; output: string; explanation: string }[]
- constraints: string[]
- notes: string[]
- totalTestCases: number
- isActive: boolean

## submissions/{submissionId}

- userId: string
- challengeId: string
- language: "javascript" | "python" | "java" | "cpp"
- code: string
- explanation: string
- conceptualReasoning: string
- pasteEventCount: number
- testCasesPassed: number
- totalTestCases: number
- runtime: string
- memory: string
- codeScore: number
- explanationScore: number
- conceptualScore: number
- aiProbability: number
- integrityImpact: number
- finalSkillScore: number
- status: "queued" | "verified" | "flagged" | "rejected"
- createdAt: string
- updatedAt: string

## scores/{userId}

- skillRankScore: number
- integrityScore: number
- contributionScore: number
- percentile: number
- aiRiskLevel: "Low" | "Medium" | "High"
- updatedAt: string

## leaderboard/{entryId}

- userId: string
- weekKey: string
- skill: string
- skillRankScore: number
- integrityScore: number
- contributionScore: number
- weeklyPoints: number
- createdAt: string

## skillExchanges/{exchangeId}

- teacherId: string
- learnerId: string
- skill: string
- status: "pending" | "active" | "completed" | "withdrawn"
- baselineVerified: boolean
- scheduledAt: string
- feedbackScore: number
- contributionDelta: number
- integrityDelta: number

## sessions/{sessionId}

- exchangeId: string
- teacherId: string
- learnerId: string
- startedAt: string
- endedAt: string
- verified: boolean

## recruiters/{recruiterId}

- company: string
- role: string
- permissions: {
  canViewRawCode: boolean;
  canExportProfiles: boolean;
  }
- createdAt: string

## logs/{logId}

- userId: string
- challengeId: string
- aiProbability: number
- pasteEventCount: number
- timestamp: string
- integrityChanges: number
- reason: string

## analytics/{docId}

- totalUsers: number
- aiMisuseRate: number
- averageSkillScore: number
- integrityDistribution: { high: number; medium: number; low: number }
- activeExchanges: number
- failedBaselineTests: number
- mostRequestedSkills: string[]
- updatedAt: string
