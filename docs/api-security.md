# API Security Plan

This project now uses a three-layer baseline for protecting API credentials and admin routes during local development, deployment, and code pushes.

## 1. Keep third-party secrets on the server only

- `OPENAI_API_KEY` is read only from server-side code in `src/lib/server/env.ts`.
- `src/lib/server/provider.ts` consumes the centralized server env module instead of reading `process.env` inline everywhere.
- Never expose provider secrets through `NEXT_PUBLIC_*`.
- Client pages should continue calling your own `/api/*` routes, not DashScope/OpenAI directly from the browser.

## 2. Lock down admin routes in deployment

- `/admin/*` and `/api/admin/*` are protected by Basic Auth in `middleware.ts`.
- Set both `ADMIN_BASIC_AUTH_USER` and `ADMIN_BASIC_AUTH_PASSWORD` in your deployment platform before going live.
- In production, if those variables are missing, admin pages return `503` instead of silently staying public.
- This is a strong temporary control until you add a proper user/session system.

Recommended production environment variables:

```bash
OPENAI_API_KEY=...
OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
OPENAI_MODEL=qwen3.5-plus-2026-02-15
NEXT_PUBLIC_APP_URL=https://your-domain.example
ADMIN_BASIC_AUTH_USER=admin
ADMIN_BASIC_AUTH_PASSWORD=<a-long-random-password>
```

## 3. Block accidental secret pushes

- `.env*` remains ignored by Git, so local secret files stay out of the repository by default.
- `npm run security:scan` scans tracked and staged files for likely hard-coded credentials.
- The repo now installs a `pre-push` hook through `npm install` by setting `core.hooksPath` to `.githooks`.
- If someone accidentally hard-codes a token in source, the push is blocked before it leaves the machine.

## Deployment checklist

1. Store real secrets only in your host's environment-variable dashboard.
2. Use different API keys for local development, staging, and production.
3. Rotate the production key immediately if it was ever pasted into code, logs, screenshots, or chat.
4. Keep admin credentials separate from provider keys.
5. Add request rate limiting and real admin authentication before opening the product to external users.
