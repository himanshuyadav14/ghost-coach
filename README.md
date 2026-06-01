# Ghost Coach

**Your AI cricket batting coach — from snapshot to session to sustained improvement.**

Ghost Coach is a full-stack web app that helps amateur and club-level batsmen get actionable coaching feedback without waiting for a human coach. Upload a batting photo, receive structured AI analysis, track scores over time, and follow up with a context-aware coach chat tied to your profile and past sessions.

Built as a take-home assignment demonstrating product thinking, AI integration, and production-minded frontend engineering.

---

## Why This Product Exists

Most club and recreational cricketers practice alone. They rarely get timely, specific feedback on technique — and when they do, it is often vague ("watch the ball") rather than actionable. Ghost Coach closes that gap by:

1. **Lowering the barrier** — a single photo is enough to start (no video upload, no booking a coach).
2. **Making feedback structured** — scores, strengths, priority fixes, and drills instead of free-form text.
3. **Creating continuity** — sessions are saved, progress is charted, and follow-up chat references prior analysis.
4. **Personalizing to the player** — experience level, role, and goals shape both analysis and chat responses.

The product is intentionally scoped to **cricket batting** rather than a generic sports app. Narrow focus improves prompt quality, UI clarity, and evaluation of whether AI output is actually useful.

---

## Features

### Core loop

| Feature | Description |
|---------|-------------|
| **Auth & player profile** | Register with name, email, password, and experience level. A `PlayerProfile` (sport, role, skill level) is created automatically. |
| **Technique analysis** | Upload a PNG/JPEG batting image (max 5MB). Gemini Vision returns a structured coaching report with score, strengths, areas to improve, priority fix, drill, and confidence level. |
| **Session history** | Every successful analysis is saved with the image and report. Browse past sessions in a card grid with thumbnails and scores. |
| **Coach chat** | Context-aware Gemini chat using player profile + optional selected session feedback. Message threads persist in MongoDB. |
| **Progress dashboard** | Live stats (total sessions, latest score, score change) and a Recharts line chart of score progression over time. |

### UX polish

- Skeleton loaders, empty states, and error states with retry across dashboard, sessions, analysis, and chat
- Sonner toast notifications for success and failure
- Mobile-responsive layout for dashboard, upload, history, and chat
- Post-analysis CTAs: "View in History" and "Chat with Coach" linked to the saved session

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui |
| Database | MongoDB + Mongoose |
| Auth | JWT in httpOnly cookies (`jose`, `bcryptjs`) |
| AI | Google Gemini (`@google/generative-ai`) — Vision for analysis, chat for coaching |
| Forms & validation | React Hook Form + Zod |
| Charts | Recharts |
| Notifications | Sonner |
| State | Zustand (UI/auth client state) |

---

## Getting Started

### Prerequisites

- **Node.js 20+**
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Gemini API key** — from [Google AI Studio](https://aistudio.google.com/apikey)

### Setup

```bash
# Clone and install
git clone <repo-url>
cd ghost-coach
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local — see Environment Variables below

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### First-run walkthrough

1. **Register** at `/register` — choose your experience level (beginner / intermediate / advanced).
2. **Analyze** — go to **Analysis**, upload a batting stance photo, and review the coaching report.
3. **Track** — check **Dashboard** for your score on the progression chart.
4. **Revisit** — open **Sessions** to browse history; click a card for full feedback.
5. **Follow up** — use **Coach Chat** with a session selected and ask e.g. *"How do I improve my front foot movement?"*

### Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | Yes | Public app URL (default: `http://localhost:3000`) |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret for signing JWTs (min 32 characters in production) |
| `JWT_EXPIRES_IN` | No | Token expiry (default: `7d`) |
| `GEMINI_API_KEY` | Yes | Google AI Studio API key |
| `GEMINI_MODEL` | No | Model name (default: `gemini-2.0-flash`) |
| `NODE_ENV` | No | `development` or `production` |

---

## Architecture Decisions

### Thin routes, fat services

API route handlers in `src/app/api/**` stay minimal: authenticate, validate input, call a service, return a typed response. Business logic lives in `src/lib/` (`auth.service`, `session.service`, `chat.service`, `analyze-batting`).

**Why:** Easier to test, reuse, and reason about. Routes become a stable HTTP boundary.

### Structured AI output, not free text

Analysis returns a fixed JSON schema (`overallScore`, `strengths`, `areasToImprove`, `priorityFix`, `drillSuggestion`, `confidenceLevel`) validated with Zod after Gemini responds.

**Why:** Enables consistent UI (score ring, badges, charts), reliable persistence, and chat context injection without parsing prose.

### Session-scoped chat threads

One MongoDB thread per `(userId, sessionId)` when a session is selected; one general thread per user when no session is linked. Threads are reused on subsequent messages.

**Why:** Keeps conversation context aligned with the analysis the player is asking about, without mixing unrelated session feedback.

### Images stored in MongoDB

Batting images are stored as `Buffer` on `CoachingSession`, served via `GET /api/sessions/[id]/image`.

**Why:** Simplifies the assignment stack (no S3/Cloudinary setup). Acceptable for demo scale; not ideal for production volume (see limitations).

### JWT in httpOnly cookies

Tokens are never exposed to client JavaScript. Middleware protects `/dashboard/*`; API routes use `withAuth`.

**Why:** Reduces XSS token theft risk compared to localStorage.

### Product-first error handling

Gemini failures return `502 ANALYSIS_FAILED` / `CHAT_FAILED`. The UI shows inline errors, retry actions, and toasts — not silent failures.

---

## AI Prompt Design

Ghost Coach uses two distinct prompt strategies: **structured extraction** (analysis) and **conversational coaching** (chat).

### 1. Technique analysis (Gemini Vision)

**File:** `src/lib/gemini/analyze-batting.ts`

| Design choice | Rationale |
|---------------|-----------|
| Role: expert cricket batting coach | Keeps output domain-specific, not generic vision captions |
| Inject `playerName` + `experienceLevel` | Beginners get simple fundamentals; advanced players get biomechanics-level detail |
| Explicit JSON schema in prompt | Reduces markdown wrapping; paired with Zod parsing as a safety net |
| `confidenceLevel` field | Signals when the image is unclear — sets honest expectations in the UI |
| Graceful degradation instruction | If image is poor, still return valid JSON with lower score and `Low` confidence |

Experience-level guidance example:

- **Beginner** — stance, grip, balance; basic drills; simple language
- **Intermediate** — timing, footwork, shot selection; structured drills
- **Advanced** — biomechanics, power generation, match adjustments

### 2. Coach chat (Gemini Chat)

**File:** `src/lib/chat/build-coach-context.ts`

The system instruction assembles context from three layers:

| Layer | Source | Used for |
|-------|--------|----------|
| Identity | User name | Personalization |
| Profile | `PlayerProfile` — sport, role, skill level, handedness, goals | Baseline coaching tone and focus |
| Session (optional) | `CoachingSession.report` — score, strengths, weaknesses, priority fix, drill | Anchoring answers to a specific analysis |

**Coaching rules baked into the prompt:**

- Respond as Ghost Coach, not a generic assistant
- Give drills, cues, and progressions — not vague encouragement
- When a session is selected, tie advice to that session's findings
- Never claim to have seen new video; only reference provided session data
- Keep responses concise (2–4 short paragraphs)

**Why session anchoring matters:** Without it, chat would feel like a disconnected ChatGPT wrapper. With it, *"How do I fix my front foot?"* can reference the player's actual `priorityFix` from their last upload.

---

## Project Structure

```
src/
├── app/
│   ├── (marketing)/          # Landing page
│   ├── (auth)/               # Login, register
│   ├── (dashboard)/          # Dashboard, analysis, sessions, chat
│   └── api/                  # REST endpoints
├── components/
│   ├── ui/                   # shadcn primitives
│   ├── shared/               # EmptyState, ErrorState
│   ├── analysis/             # Upload, report, loading
│   ├── sessions/             # Cards, modal, skeletons
│   ├── chat/                 # Chat interface, messages, prompts
│   └── dashboard/            # Stats, progress chart
├── lib/
│   ├── api/                  # Client, handlers, response helpers
│   ├── auth/                 # JWT, cookies, session
│   ├── chat/                 # Context builder, Gemini chat, service
│   ├── gemini/               # Vision analysis
│   ├── sessions/             # Session CRUD
│   └── validations/          # Zod schemas
├── models/                   # User, PlayerProfile, CoachingSession, ChatThread
├── types/                    # Shared TypeScript types
└── middleware.ts             # Route protection
```

### API overview

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/auth/register` | Create account + player profile |
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/logout` | Clear session |
| GET | `/api/auth/me` | Current user |
| POST | `/api/analysis` | Upload image → Gemini analysis → save session |
| GET | `/api/sessions` | Paginated session list |
| GET | `/api/sessions/[id]` | Session detail |
| GET | `/api/sessions/[id]/image` | Session image |
| POST | `/api/chat` | Send coach message |
| GET | `/api/chat/[threadId]` | Thread messages |
| GET | `/api/chat/threads` | User's threads |

---

## Known Limitations

These are intentional trade-offs for assignment scope and should be understood when evaluating the product:

| Limitation | Impact |
|------------|--------|
| **Single static image, not video** | Analysis is a snapshot, not a full shot lifecycle. Footwork and timing are inferred with lower confidence. |
| **No human coach verification** | AI can hallucinate or misread blurry images. `confidenceLevel` mitigates but does not eliminate this. |
| **One scalar score (0–100)** | Progress chart tracks overall score only — no per-dimension breakdown (stance vs. footwork vs. head position). |
| **Images in MongoDB** | Works for demos; at scale, object storage (S3, Cloudinary) would be more appropriate. |
| **No streaming chat** | Full response waits for Gemini to finish; no token-by-token UX. |
| **English only** | Prompts and UI are English-first. |
| **Cricket batting only** | Bowlers, other sports, and team/coach dashboards are out of scope. |
| **Chat cannot analyze new images** | Players must run a new analysis upload; chat references existing session reports only. |

---

## Future Improvements

Prioritized by product impact:

### High impact

1. **Video upload + frame extraction** — Analyze a clip (drive, pull, defensive block) for richer feedback than a single still.
2. **Dimensional scoring** — Break `overallScore` into stance, footwork, head position, and backlift for clearer progress tracking.
3. **Coach review layer** — Flag low-confidence analyses for human review or display a "verify with your coach" disclaimer prominently.
4. **Drill library** — Link `drillSuggestion` to short video demos or printable practice cards.

### Medium impact

5. **Streaming chat responses** — Improve perceived latency with SSE/token streaming.
6. **Push notifications / email digests** — "You haven't analyzed in 2 weeks" or weekly progress summary.
7. **Object storage for images** — Move blobs to S3/Cloudinary; keep MongoDB for metadata only.
8. **Pagination & search on sessions** — Scale history beyond the first 20–50 sessions.

### Nice to have

9. **Team / academy mode** — Coach sees multiple players, assigns drills, compares cohort progress.
10. **OAuth (Google)** — Reduce registration friction.
11. **Offline-friendly PWA** — View past sessions without network.
12. **Multi-language prompts** — Hindi, Urdu, etc. for South Asian club cricket markets.

---

## Sport Focus

- **Sport:** Cricket
- **Role:** Batsman
- Domain types: `src/types/cricket.ts`

---

## License

Private — take-home assignment project.
