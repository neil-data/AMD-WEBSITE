# SkillRank AI

**Fast hiring intelligence for students and recruiters.**

SkillRank AI is a full-stack platform where students build a verified, recruiter-ready skill record through real DSA challenges, peer learning exchanges, and AI-integrity scoring. Recruiters get a transparent hiring panel with ranked candidate profiles, submission logs, and integrity signals — no résumé guesswork.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Firestore Data Model](#firestore-data-model)
- [Role-Based Access](#role-based-access)
- [API Reference](#api-reference)
- [Scripts](#scripts)

---

## Overview

SkillRank AI solves a core hiring problem: self-reported skills are unverifiable. The platform creates a closed loop:

1. Students solve DSA challenges in a Monaco code editor (JS, Python, Java, C++)
2. Each submission is scored across code quality, explanation depth, and an AI-usage probability signal
3. Scores roll up into a live **SkillRank Score**, **Integrity Score**, and **Percentile Rank**
4. Students can enter **Skill Exchanges** — peer teaching/mentoring sessions that boost Contribution Score
5. A public leaderboard exposes weekly rankings by skill and consistency
6. Recruiters access a dedicated dashboard showing filtered candidate records, radar charts, and flagged submission logs

---

## Features

### For Students

| Feature                   | Description                                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| **DSA Challenge Bank**    | Curated problems with difficulty tiers (Easy / Medium / Hard), test cases, constraints, and examples |
| **Monaco Code Editor**    | In-browser editor with syntax highlighting for JavaScript, Python, Java, and C++                     |
| **AI Evaluation Engine**  | Scores code quality, explanation depth, and conceptual reasoning; flags AI-generated patterns        |
| **Integrity Ring**        | Visual gauge showing your integrity score and AI-risk level (Low / Medium / High)                    |
| **Skill Exchange**        | Request or accept peer mentoring sessions; earn Contribution Score deltas                            |
| **Leaderboard**           | Weekly rankings with percentile progress and streak tracking                                         |
| **Animated Skill Unlock** | Confetti + reveal animation when a new skill tier is unlocked                                        |

### For Recruiters

| Feature             | Description                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------- |
| **Candidate Panel** | Searchable, filterable list of students ranked by SkillRank Score                             |
| **Filter Controls** | Filter by skill, AI risk level, minimum score, and minimum integrity score                    |
| **Profile Charts**  | Radar chart (Logic, Speed, Integrity, Collaboration, Consistency) and bar chart per candidate |
| **Submission Logs** | Flagged and verified submission history with AI probability per entry                         |
| **Hiring Signals**  | Integrity score, contribution score, and AI risk badge per candidate                          |

### Platform-Wide

- Role-based routing and dashboards (`student`, `recruiter`, `admin`)
- Firestore security rules enforcing ownership and role checks
- Rate-limited AI evaluation API (10 requests/minute per IP)
- Dark design system with glow effects and Framer Motion page transitions
- Cursor spotlight and scroll-driven animation effects

---

## Tech Stack

| Layer             | Technology                                    |
| ----------------- | --------------------------------------------- |
| Framework         | Next.js 14 (App Router)                       |
| Language          | TypeScript 5                                  |
| Styling           | Tailwind CSS 3 with custom dark design tokens |
| Animation         | Framer Motion 11                              |
| Code Editor       | Monaco Editor (`@monaco-editor/react`)        |
| Charts            | Recharts                                      |
| State             | Zustand                                       |
| Validation        | Zod                                           |
| Auth & DB         | Firebase Auth + Firestore                     |
| Backend Functions | Firebase Cloud Functions                      |
| Icons             | Lucide React                                  |

---

## Project Structure

```
app/
  (app)/dashboard/        # Role-based dashboard routes
  api/evaluate/           # AI evaluation REST endpoint
  auth/                   # Login / sign-up page
  skills/                 # Skills browser page
components/ui/            # Shared UI primitives (Card, Button, Toast, SectionTitle)
features/
  dashboard/              # Student, recruiter, and admin dashboard components
  landing/                # Home page sections (Hero, Features, How It Works, Pricing, Footer)
  shared/                 # Auth provider, global effects, site loader, cursor spotlight
  skills/                 # Skills-related feature components
hooks/                    # use-toast hook
lib/                      # Utilities, motion presets, mock data, Zod validation schemas
services/
  firebase/               # Firebase admin and client initializers
  skillrank/              # Gating logic (skill unlock rules)
functions/                # Firebase Cloud Functions source
docs/                     # Firestore schema reference
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with Firestore and Authentication enabled

### Install

```bash
npm install
```

### Run in development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm run start
```

### Type-check

```bash
npm run typecheck
```

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Firebase client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK (server-side only)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

---

## Firestore Data Model

Full schema is documented in [docs/firestore-schema.md](docs/firestore-schema.md). Key collections:

| Collection                    | Purpose                                  |
| ----------------------------- | ---------------------------------------- |
| `users/{userId}`              | Profile, role, scores, badges            |
| `challenges/{challengeId}`    | DSA problem definitions                  |
| `submissions/{submissionId}`  | Code submissions with evaluation results |
| `scores/{userId}`             | Denormalized score cache for fast reads  |
| `leaderboard/{entryId}`       | Weekly ranked entries                    |
| `skillExchanges/{exchangeId}` | Peer teaching sessions                   |
| `sessions/{sessionId}`        | Individual exchange session records      |
| `recruiters/{recruiterId}`    | Recruiter company and role metadata      |

---

## Role-Based Access

| Role        | Capabilities                                                        |
| ----------- | ------------------------------------------------------------------- |
| `student`   | Submit challenges, view own scores, join exchanges, see leaderboard |
| `recruiter` | Read all user profiles, filter candidates, view submission logs     |
| `admin`     | All recruiter access + write challenges + update any user profile   |

Firestore security rules enforce these boundaries server-side — client-side routing is an additional UX guard only.

---

## API Reference

### `POST /api/evaluate`

Evaluates a code submission and returns skill scores.

**Rate limit:** 10 requests per minute per IP.

**Request body:**

```json
{
  "code": "string",
  "explanation": "string",
  "conceptualReasoning": "string",
  "pasteEventCount": 0
}
```

**Response:**

```json
{
  "testCasesPassed": 8,
  "totalTestCases": 10,
  "runtime": "48ms",
  "memory": "12.4MB",
  "codeScore": 84,
  "explanationScore": 79,
  "conceptualScore": 76,
  "aiProbability": 0.12,
  "integrityImpact": 6,
  "finalSkillScore": 81
}
```

`aiProbability` ranges from `0.05` to `0.97`. Submissions above `0.65` are flagged.

---

## Scripts

| Script                       | Description                         |
| ---------------------------- | ----------------------------------- |
| `scripts/deploy-rules.mjs`   | Deploy Firestore security rules     |
| `scripts/fix-and-deploy.mjs` | Fix common rule issues and redeploy |
| `scripts/debug-deploy.mjs`   | Verbose deploy with diagnostics     |

Run with:

```bash
node scripts/deploy-rules.mjs
```
