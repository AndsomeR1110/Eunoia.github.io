# Eunoia

Eunoia is a youth-centered AI mental health support framework built with `Next.js App Router + TypeScript + Tailwind CSS`. This repository implements the v1 scaffold for:

- anonymous alias onboarding
- empathetic chat with risk classification
- crisis-script bypass for high-risk messages
- mood tracking and guided coping exercises
- RAG-style knowledge review and publishing
- internal admin views for content, risk events, and resource editing

## Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Zod validation
- OpenAI-compatible provider adapter configured for DashScope / Qwen by default
- PostgreSQL + pgvector schema included in `db/schema.sql`

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Start the app:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000).

## Environment variables

- `OPENAI_API_KEY`: optional; if omitted, the chat provider falls back to a deterministic demo reply generator.
- `OPENAI_BASE_URL`: defaults to `https://dashscope.aliyuncs.com/compatible-mode/v1`.
- `OPENAI_MODEL`: defaults to `qwen3.6-flash-2026-04-16`. You can switch to `qwen3.6-plus` when you want a more capable but slower model.
- `OPENAI_ENABLE_THINKING`: defaults to `false`. Keep it disabled for low-latency chat unless you explicitly want longer chain-of-thought style reasoning from compatible Qwen models.
- `OPENAI_TIMEOUT_MS`: provider timeout in milliseconds. Default is `25000`.
- `ALLOW_DEMO_MODE`: when `true`, Eunoia can fall back to demo replies if the provider is missing or temporarily failing. For production, set this to `false` if you want deployment to depend on a real model backend.
- `DATABASE_URL`: reserved for PostgreSQL integration.
- `NEXT_PUBLIC_APP_URL`: app base URL for deployment contexts.
- `ADMIN_BASIC_AUTH_USER`: protects `/admin/*` and `/api/admin/*` in deployment.
- `ADMIN_BASIC_AUTH_PASSWORD`: password paired with `ADMIN_BASIC_AUTH_USER`.

### DashScope quick start

Set the following in `.env.local`:

```bash
OPENAI_API_KEY=your-dashscope-api-key
OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
OPENAI_MODEL=qwen3.6-flash-2026-04-16
OPENAI_ENABLE_THINKING=false
```

If you want a stronger but slower model, switch to:

```bash
OPENAI_MODEL=qwen3.6-plus
```

## Backend readiness for Vercel

The app already runs a server-side backend through Next.js route handlers under `src/app/api/*`.

- `POST /api/chat/session`
- `POST /api/chat/message`
- `GET /api/health`
- `POST /api/mood/check-in`
- `GET /api/mood/check-in`
- `GET /api/skills`
- `GET /api/resources`

### Recommended production settings

For Vercel deployments:

```bash
OPENAI_API_KEY=your-real-provider-key
OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
OPENAI_MODEL=qwen3.6-flash-2026-04-16
OPENAI_ENABLE_THINKING=false
OPENAI_TIMEOUT_MS=25000
ALLOW_DEMO_MODE=false
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
ADMIN_BASIC_AUTH_USER=your-admin-user
ADMIN_BASIC_AUTH_PASSWORD=your-strong-password
```

### Health check

After deployment, verify backend connectivity at:

```bash
GET /api/health
```

It returns whether the provider is configured, whether demo fallback is enabled, and the current runtime environment.

## API security baseline

- Keep provider keys only in `.env.local` locally and in your deployment platform's environment-variable settings remotely.
- Never place real secrets in `NEXT_PUBLIC_*` variables.
- `/admin/*` and `/api/admin/*` are guarded by Basic Auth via `middleware.ts`.
- `npm run security:scan` checks tracked files for likely hard-coded secrets.
- `npm install` configures a `pre-push` hook so the scan runs automatically before pushes.

Full rollout guidance is in `docs/api-security.md`.

## Current persistence mode

The app is implemented with a working in-memory store so the prototype can run immediately without a database.

- Production database schema is already drafted in `db/schema.sql`.
- High-risk events, mood check-ins, sessions, knowledge docs, and resources are all modeled.
- RAG retrieval only searches `published` knowledge documents.

## Core routes

### User pages

- `/onboarding`
- `/chat`
- `/mood`
- `/skills`
- `/help-now`

### Admin pages

- `/admin/content`
- `/admin/risk`
- `/admin/resources`

### APIs

- `GET /api/health`
- `POST /api/chat/session`
- `POST /api/chat/message`
- `POST /api/mood/check-in`
- `GET /api/mood/check-in`
- `GET /api/skills`
- `GET /api/resources`
- `POST /api/admin/content/import`
- `POST /api/admin/content/publish`
- `GET /api/admin/risk-events`
- `PUT /api/admin/resources/:id`

## Safety design

- Eunoia is explicitly positioned as an AI support tool, not a clinician.
- Messages are classified into `LOW`, `MODERATE`, `HIGH`, and `CRITICAL`.
- `HIGH` and `CRITICAL` messages bypass freeform model generation and return a scripted crisis response.
- Crisis resources remain visible in the user flow and are editable in the admin flow.

## Prompt assets

- System prompt: `src/lib/prompts.ts`
- UI design prompt: `src/lib/prompts.ts`

## Quality checks

```bash
npm run lint
npm run test
npm run build
```

## Suggested next implementation steps

1. Replace the in-memory store with PostgreSQL repositories backed by `db/schema.sql`.
2. Add authentication for the admin console.
3. Add embedding generation and actual pgvector similarity search.
4. Add region-aware resource localization and internationalization.
