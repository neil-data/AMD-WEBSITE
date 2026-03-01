export type ChallengeExample = {
  input: string;
  output: string;
  explanation: string;
};

export type ChallengeItem = {
  id: string;
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  points: number;
  statement: string;
  examples: [ChallengeExample, ChallengeExample];
  constraints: string[];
  notes?: string[];
  totalTestCases: number;
};

export type CandidateRecord = {
  id: string;
  candidate: string;
  role: string;
  solved: number;
  avgScore: number;
  integrityScore: number;
  aiRisk: "Low" | "Medium" | "High";
  latestChallenge: string;
  skills: string[];
  percentile: number;
  verifiedBadges: string[];
  weeklyTrend: number[];
};

export type SkillExchangeItem = {
  id: string;
  teacherId: string;
  learnerId: string;
  skill: string;
  status: "active" | "completed" | "pending" | "withdrawn";
  baselineVerified: boolean;
  scheduledAt: string;
  feedbackScore?: number;
};

export type FlaggedSubmissionLog = {
  id: string;
  userId: string;
  challengeId: string;
  aiProbability: number;
  pasteEventCount: number;
  timestamp: string;
  integrityDelta: number;
};

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  name: string;
  skill: string;
  skillRank: number;
  integrity: number;
  contributions: number;
  weeklyPoints: number;
};

const challengeSpecs: Array<{ title: string; difficulty: "Easy" | "Medium" | "Hard"; topic: string; points: number }> = [
  { title: "Two Sum", difficulty: "Easy", topic: "Arrays", points: 20 },
  { title: "Valid Parentheses", difficulty: "Easy", topic: "Stacks", points: 20 },
  { title: "Merge Sorted Array", difficulty: "Easy", topic: "Two Pointers", points: 20 },
  { title: "Best Time to Buy and Sell Stock", difficulty: "Easy", topic: "Greedy", points: 20 },
  { title: "Contains Duplicate", difficulty: "Easy", topic: "Hashing", points: 20 },
  { title: "Longest Common Prefix", difficulty: "Easy", topic: "Strings", points: 20 },
  { title: "Move Zeroes", difficulty: "Easy", topic: "Arrays", points: 20 },
  { title: "Binary Search", difficulty: "Easy", topic: "Search", points: 20 },
  { title: "Flood Fill", difficulty: "Easy", topic: "Graphs", points: 20 },
  { title: "Climbing Stairs", difficulty: "Easy", topic: "Dynamic Programming", points: 20 },
  { title: "3Sum", difficulty: "Medium", topic: "Two Pointers", points: 35 },
  { title: "Longest Substring Without Repeating Characters", difficulty: "Medium", topic: "Sliding Window", points: 35 },
  { title: "Group Anagrams", difficulty: "Medium", topic: "Hashing", points: 35 },
  { title: "Product of Array Except Self", difficulty: "Medium", topic: "Prefix Sum", points: 35 },
  { title: "Top K Frequent Elements", difficulty: "Medium", topic: "Heap", points: 35 },
  { title: "Kth Largest Element in an Array", difficulty: "Medium", topic: "Heap", points: 35 },
  { title: "Search in Rotated Sorted Array", difficulty: "Medium", topic: "Binary Search", points: 35 },
  { title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", topic: "Binary Search", points: 35 },
  { title: "Longest Palindromic Substring", difficulty: "Medium", topic: "Strings", points: 35 },
  { title: "Decode String", difficulty: "Medium", topic: "Stacks", points: 35 },
  { title: "Coin Change", difficulty: "Medium", topic: "Dynamic Programming", points: 35 },
  { title: "House Robber II", difficulty: "Medium", topic: "Dynamic Programming", points: 35 },
  { title: "Number of Islands", difficulty: "Medium", topic: "Graphs", points: 35 },
  { title: "Course Schedule", difficulty: "Medium", topic: "Graphs", points: 35 },
  { title: "Pacific Atlantic Water Flow", difficulty: "Medium", topic: "Graphs", points: 35 },
  { title: "Word Break", difficulty: "Medium", topic: "Dynamic Programming", points: 35 },
  { title: "Subarray Sum Equals K", difficulty: "Medium", topic: "Prefix Sum", points: 35 },
  { title: "Spiral Matrix", difficulty: "Medium", topic: "Simulation", points: 35 },
  { title: "Daily Temperatures", difficulty: "Medium", topic: "Monotonic Stack", points: 35 },
  { title: "Min Stack", difficulty: "Medium", topic: "Design", points: 35 },
  { title: "Merge Intervals", difficulty: "Medium", topic: "Intervals", points: 35 },
  { title: "Insert Interval", difficulty: "Medium", topic: "Intervals", points: 35 },
  { title: "Rotate Image", difficulty: "Medium", topic: "Matrix", points: 35 },
  { title: "Set Matrix Zeroes", difficulty: "Medium", topic: "Matrix", points: 35 },
  { title: "Partition Labels", difficulty: "Medium", topic: "Greedy", points: 35 },
  { title: "Reorder List", difficulty: "Medium", topic: "Linked List", points: 35 },
  { title: "Copy List with Random Pointer", difficulty: "Medium", topic: "Linked List", points: 35 },
  { title: "Implement Trie", difficulty: "Medium", topic: "Trie", points: 35 },
  { title: "Add and Search Word", difficulty: "Medium", topic: "Trie", points: 35 },
  { title: "LRU Cache", difficulty: "Medium", topic: "Design", points: 35 },
  { title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "Binary Search", points: 50 },
  { title: "Merge K Sorted Lists", difficulty: "Hard", topic: "Heap", points: 50 },
  { title: "Trapping Rain Water", difficulty: "Hard", topic: "Two Pointers", points: 50 },
  { title: "Sliding Window Maximum", difficulty: "Hard", topic: "Deque", points: 50 },
  { title: "Minimum Window Substring", difficulty: "Hard", topic: "Sliding Window", points: 50 },
  { title: "Word Ladder", difficulty: "Hard", topic: "Graphs", points: 50 },
  { title: "N-Queens", difficulty: "Hard", topic: "Backtracking", points: 50 },
  { title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", topic: "Trees", points: 50 },
  { title: "Maximal Rectangle", difficulty: "Hard", topic: "Dynamic Programming", points: 50 },
  { title: "Regular Expression Matching", difficulty: "Hard", topic: "Dynamic Programming", points: 50 }
];

export const challengeBank: ChallengeItem[] = challengeSpecs.map((spec, index) => {
  const number = index + 1;
  const sizeCap = spec.difficulty === "Easy" ? 10_000 : spec.difficulty === "Medium" ? 200_000 : 500_000;

  return {
    id: `q-${number}`,
    slug: spec.title.toLowerCase().replaceAll(" ", "-"),
    title: spec.title,
    difficulty: spec.difficulty,
    topic: spec.topic,
    points: spec.points,
    statement: `Given inputs for ${spec.topic.toLowerCase()}, implement ${spec.title} with optimal time and memory complexity. Return exactly the required output shape and handle edge-cases explicitly.`,
    examples: [
      {
        input: `nums = [${number}, ${number + 2}, ${number + 4}]`,
        output: `[${number + 2}]`,
        explanation: `A valid approach based on ${spec.topic.toLowerCase()} derives the expected output.`
      },
      {
        input: `nums = [${number + 1}, ${number + 3}]`,
        output: `[${number + 3}]`,
        explanation: `The second example validates edge handling and deterministic output formatting.`
      }
    ],
    constraints: [
      `1 <= n <= ${sizeCap}`,
      "Expected complexity must outperform brute-force for full input bounds.",
      "Output ordering and formatting must exactly match the judge contract."
    ],
    notes: [
      "Use integer-safe operations for all index arithmetic.",
      "Document reasoning for edge-cases in the explanation field."
    ],
    totalTestCases: spec.difficulty === "Easy" ? 10 : spec.difficulty === "Medium" ? 12 : 14
  };
});

export const candidateRecords: CandidateRecord[] = [
  {
    id: "u-neil",
    candidate: "Neil R.",
    role: "Frontend Engineer",
    solved: 34,
    avgScore: 93,
    integrityScore: 96,
    aiRisk: "Low",
    latestChallenge: "Merge Intervals",
    skills: ["React", "TypeScript", "Algorithms"],
    percentile: 98,
    verifiedBadges: ["Integrity Verified", "Top 1%", "Mentor"],
    weeklyTrend: [86, 89, 92, 93]
  },
  {
    id: "u-maya",
    candidate: "Maya K.",
    role: "Backend Engineer",
    solved: 31,
    avgScore: 91,
    integrityScore: 94,
    aiRisk: "Low",
    latestChallenge: "Course Schedule",
    skills: ["Node", "Distributed Systems", "Graph"],
    percentile: 96,
    verifiedBadges: ["Integrity Verified", "Systems Strong"],
    weeklyTrend: [84, 88, 90, 91]
  },
  {
    id: "u-rahul",
    candidate: "Rahul P.",
    role: "SDE-1",
    solved: 27,
    avgScore: 88,
    integrityScore: 81,
    aiRisk: "Medium",
    latestChallenge: "Word Break",
    skills: ["Java", "DSA", "OOP"],
    percentile: 89,
    verifiedBadges: ["Baseline Passed"],
    weeklyTrend: [80, 82, 86, 88]
  },
  {
    id: "u-aarav",
    candidate: "Aarav T.",
    role: "SDE-1",
    solved: 25,
    avgScore: 86,
    integrityScore: 92,
    aiRisk: "Low",
    latestChallenge: "Top K Frequent Elements",
    skills: ["C++", "Competitive Programming", "Heaps"],
    percentile: 85,
    verifiedBadges: ["Integrity Verified", "Fast Runtime"],
    weeklyTrend: [78, 82, 85, 86]
  },
  {
    id: "u-ishaan",
    candidate: "Ishaan V.",
    role: "Platform Engineer",
    solved: 22,
    avgScore: 84,
    integrityScore: 79,
    aiRisk: "Medium",
    latestChallenge: "Sliding Window Maximum",
    skills: ["Go", "Kubernetes", "Systems"],
    percentile: 79,
    verifiedBadges: ["Baseline Passed"],
    weeklyTrend: [72, 76, 81, 84]
  }
];

export const leaderboardEntries: LeaderboardEntry[] = [
  { rank: 1, userId: "u-neha", name: "Neha", skill: "Algorithms", skillRank: 1470, integrity: 97, contributions: 140, weeklyPoints: 54 },
  { rank: 2, userId: "u-neil", name: "Neil", skill: "Frontend", skillRank: 1455, integrity: 96, contributions: 138, weeklyPoints: 52 },
  { rank: 3, userId: "u-rahul", name: "Rahul", skill: "Backend", skillRank: 1425, integrity: 82, contributions: 119, weeklyPoints: 45 },
  { rank: 4, userId: "u-maya", name: "Maya", skill: "Distributed Systems", skillRank: 1412, integrity: 94, contributions: 132, weeklyPoints: 44 },
  { rank: 5, userId: "u-aarav", name: "Aarav", skill: "C++", skillRank: 1388, integrity: 92, contributions: 111, weeklyPoints: 40 },
  { rank: 6, userId: "u-ishaan", name: "Ishaan", skill: "Systems", skillRank: 1360, integrity: 79, contributions: 98, weeklyPoints: 37 },
  { rank: 7, userId: "u-ria", name: "Ria", skill: "Python", skillRank: 1338, integrity: 90, contributions: 93, weeklyPoints: 33 },
  { rank: 8, userId: "u-kabir", name: "Kabir", skill: "Java", skillRank: 1314, integrity: 88, contributions: 86, weeklyPoints: 31 }
];

export const skillExchanges: SkillExchangeItem[] = [
  {
    id: "ex-101",
    teacherId: "u-neil",
    learnerId: "u-rahul",
    skill: "React Performance",
    status: "active",
    baselineVerified: true,
    scheduledAt: "2026-03-03T17:00:00.000Z"
  },
  {
    id: "ex-102",
    teacherId: "u-maya",
    learnerId: "u-aarav",
    skill: "System Design Basics",
    status: "completed",
    baselineVerified: true,
    scheduledAt: "2026-02-24T15:00:00.000Z",
    feedbackScore: 5
  },
  {
    id: "ex-103",
    teacherId: "u-ishaan",
    learnerId: "u-neil",
    skill: "Kubernetes Essentials",
    status: "pending",
    baselineVerified: false,
    scheduledAt: "2026-03-07T18:30:00.000Z"
  }
];

export const flaggedSubmissionLogs: FlaggedSubmissionLog[] = [
  {
    id: "log-1",
    userId: "u-rahul",
    challengeId: "q-44",
    aiProbability: 0.82,
    pasteEventCount: 11,
    timestamp: "2026-02-28T09:22:19.000Z",
    integrityDelta: -7
  },
  {
    id: "log-2",
    userId: "u-ishaan",
    challengeId: "q-48",
    aiProbability: 0.74,
    pasteEventCount: 9,
    timestamp: "2026-02-27T16:12:49.000Z",
    integrityDelta: -5
  },
  {
    id: "log-3",
    userId: "u-ria",
    challengeId: "q-37",
    aiProbability: 0.68,
    pasteEventCount: 8,
    timestamp: "2026-02-27T11:40:12.000Z",
    integrityDelta: -3
  }
];

export const adminMetrics = {
  totalUsers: 3240,
  aiMisuseRate: 4.8,
  averageSkillScore: 78,
  activeExchanges: 226,
  failedBaselineTests: 41,
  mostRequestedSkills: ["System Design", "DSA", "React", "Python", "SQL"]
};
