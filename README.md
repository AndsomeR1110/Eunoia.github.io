# Eunoia

Eunoia is a youth-centered AI mental health support prototype built with Next.js. It focuses on a calm, chat-first experience with safety-aware response handling, mood tracking, coping exercises, and an internal admin surface for content and crisis resource management.

Live deployment: [https://eunoia-kappa.vercel.app](https://eunoia-kappa.vercel.app)

## What it does

- Anonymous onboarding with alias + conversation mode
- ChatGPT-like chat UI with streaming assistant replies
- Risk classification for each message
- Crisis-script bypass for `HIGH` and `CRITICAL` risk messages
- Mood check-ins and lightweight reflection history
- Skills / coping exercise library
- "Help now" resource directory
- Admin pages for knowledge content, risk events, and resource editing

## Current stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Zod
- OpenAI-compatible provider adapter
- Alibaba Cloud DashScope / Qwen
- PostgreSQL + pgvector schema draft in `db/schema.sql`

## AI provider

The app is currently configured for Alibaba Cloud DashScope's OpenAI-compatible API.

Default production-oriented model:

```bash
OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
OPENAI_MODEL=qwen3.6-flash-2026-04-16
OPENAI_ENABLE_THINKING=false
OPENAI_TIMEOUT_MS=60000
```

Why this default:

- `qwen3.6-flash-2026-04-16` is faster and more practical for chat UX
- `OPENAI_ENABLE_THINKING=false` reduces latency
- `OPENAI_TIMEOUT_MS=60000` avoids premature timeouts on Vercel

If you want a slower but stronger model:

```bash
OPENAI_MODEL=qwen3.6-plus
```

## Run locally

1. Install dependencies

```bash
npm install
```

2. Create local environment variables

```bash
copy .env.example .env.local
```

3. Fill in `.env.local`

```bash
OPENAI_API_KEY=your-dashscope-api-key
OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
OPENAI_MODEL=qwen3.6-flash-2026-04-16
OPENAI_ENABLE_THINKING=false
OPENAI_TIMEOUT_MS=60000
ALLOW_DEMO_MODE=false
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Start the app

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Environment variables

- `OPENAI_API_KEY`: DashScope / OpenAI-compatible API key
- `OPENAI_BASE_URL`: defaults to DashScope compatible endpoint
- `OPENAI_MODEL`: defaults to `qwen3.6-flash-2026-04-16`
- `OPENAI_ENABLE_THINKING`: defaults to `false`
- `OPENAI_TIMEOUT_MS`: defaults to `60000`
- `ALLOW_DEMO_MODE`: allow fallback demo replies when provider fails or is missing
- `NEXT_PUBLIC_APP_URL`: deployed app URL
- `DATABASE_URL`: reserved for future PostgreSQL integration
- `ADMIN_BASIC_AUTH_USER`: Basic Auth username for `/admin/*`
- `ADMIN_BASIC_AUTH_PASSWORD`: Basic Auth password for `/admin/*`

Example `.env.example` is included in the repo.

## Main routes

User pages:

- `/`
- `/onboarding`
- `/chat`
- `/mood`
- `/skills`
- `/help-now`

Admin pages:

- `/admin`
- `/admin/content`
- `/admin/risk`
- `/admin/resources`

## API routes

- `POST /api/chat/session`
- `POST /api/chat/message`
- `POST /api/chat/message/stream`
- `GET /api/health`
- `POST /api/mood/check-in`
- `GET /api/mood/check-in`
- `GET /api/skills`
- `GET /api/resources`
- `POST /api/admin/content/import`
- `POST /api/admin/content/publish`
- `GET /api/admin/risk-events`
- `PUT /api/admin/resources/:id`

## Streaming chat

The chat UI now uses a streaming backend route:

- server route: `src/app/api/chat/message/stream/route.ts`
- client UI: `src/components/chat-client.tsx`

Responses are streamed from the provider and rendered incrementally in the chat window, instead of waiting for the full assistant message to finish first.

## Safety model

- The product is positioned as an AI support tool, not a clinician
- Messages are classified into `LOW`, `MODERATE`, `HIGH`, and `CRITICAL`
- `HIGH` and `CRITICAL` messages bypass freeform model generation
- Crisis resources remain available in the user flow
- Risk events can be reviewed in the admin flow

## Deployment on Vercel

Recommended production settings:

```bash
OPENAI_API_KEY=your-real-provider-key
OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
OPENAI_MODEL=qwen3.6-flash-2026-04-16
OPENAI_ENABLE_THINKING=false
OPENAI_TIMEOUT_MS=60000
ALLOW_DEMO_MODE=false
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
ADMIN_BASIC_AUTH_USER=your-admin-user
ADMIN_BASIC_AUTH_PASSWORD=your-strong-password
```

After deployment, verify:

```bash
GET /api/health
```

It should report:

- `environment: "production"`
- `provider.configured: true`
- the expected model and timeout values

More detail: `docs/vercel-deployment.md`

## Security notes

- Keep real provider keys only in local env files and deployment platform env vars
- Never put secrets in `NEXT_PUBLIC_*`
- `/admin/*` and `/api/admin/*` are guarded by Basic Auth in deployment
- Run the secret scan before pushing:

```bash
npm run security:scan
```

## Quality checks

```bash
npm run lint
npm run test
npm run build
```

## Current limitations

This is still a prototype. The main limitation right now is persistence.

- Sessions, moods, resources, and risk events currently use an in-memory store
- The PostgreSQL / pgvector schema exists, but the runtime data layer has not been migrated yet
- This means production state is not durable across serverless instance churn

## Recommended next steps

1. Replace the in-memory store with PostgreSQL-backed repositories
2. Add durable session storage for production chat
3. Add embeddings + real pgvector retrieval
4. Improve chat controls with stop / retry / regenerate actions
5. Expand i18n and region-aware resource localization
