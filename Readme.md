# SkillRank AI

Performance-Verified, Integrity-Protected Skill Exchange Ecosystem

Production-ready, enterprise-oriented SaaS skeleton built with strict black-and-white premium UI.

## Tech Stack

- Next.js 14 App Router + Server Components
- TypeScript strict mode
- TailwindCSS monochrome design tokens
- Framer Motion micro-animations
- Monaco editor (lazy loaded)
- Recharts analytics (lazy loaded)
- Firebase Auth + Firestore + Cloud Functions

## Roles & Dashboards

### Student

- Animated overview: SkillRank, Integrity, Contribution, Percentile, AI risk, recent activity
- 50 LeetCode-style coding challenges with full statement format
- Monaco code editor with language selector (JS, Python, Java, C++)
- Mandatory explanation + conceptual reasoning before submit
- Paste event tracking and AI probability risk warnings
- Skill Exchange flow: verify baseline, accept, complete, withdraw with score impacts
- Searchable and paginated leaderboard with skill filtering and ranking mode

### Recruiter

- Candidate search and filtering by skill, score, integrity, AI risk
- Candidate profile with radar graph, AI trend, integrity history, percentile, badges
- Recent challenges solved and contribution insights
- Flagged log visibility (without raw source code)

### Admin

- Total users, AI misuse rate, average SkillScore, active exchanges, failed baseline tests
- Integrity distribution and most requested skills
- Searchable flagged submission logs
- Exchange health snapshot

## Cloud Function Pipeline

- `onSubmissionCreated`: queues submission and stamps lifecycle metadata
- `applyEvaluation` callable:
  - validates payload
  - computes final score and integrity delta
  - updates submission + scores + leaderboard
  - stores flagged/verified logs
- `onExchangeUpdated`:
  - completion reward: `contribution +8`, `integrity +4`
  - withdrawal penalty: `contribution -10`, `integrity -15`
  - leaderboard refresh

## Firestore Model

Collections:

- `users`
- `challenges`
- `submissions`
- `scores`
- `leaderboard`
- `skillExchanges`
- `sessions`
- `recruiters`
- `logs`
- `analytics`

See [docs/firestore-schema.md](docs/firestore-schema.md) for field-level contracts.

## Security

- Role-based Firestore rules in `firestore.rules`
- Server-side validation with Zod in API routes
- Submission API rate limiting for anti-spam control
- Recruiter-safe profile exposure (no raw code by default)

## Performance Strategy

- Dynamic imports for Monaco and heavy chart components
- App Router Server Components by default; client islands for interactions
- Lean UI state updates to minimize re-renders
- Indexed Firestore queries in `firestore.indexes.json`
- Edge-ready API route pattern and low payload responses

## Run Locally

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run typecheck
npm run lint
```

## Deployment

- Frontend: Vercel
- Backend: Firebase (Firestore + Functions)
- Configure environment variables securely per platform
