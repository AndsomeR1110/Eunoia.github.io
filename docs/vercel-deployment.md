# Vercel Deployment

Eunoia uses Next.js route handlers as its backend layer, so it can be deployed to Vercel without adding a separate Express or Nest server.

## 1. Required environment variables

Set these in the Vercel project settings:

```bash
OPENAI_API_KEY=your-provider-key
OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
OPENAI_MODEL=qwen3.5-plus-2026-02-15
OPENAI_TIMEOUT_MS=25000
ALLOW_DEMO_MODE=false
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
ADMIN_BASIC_AUTH_USER=your-admin-user
ADMIN_BASIC_AUTH_PASSWORD=your-strong-password
```

If you want public demo deployments to keep working even when the model backend is unavailable, set:

```bash
ALLOW_DEMO_MODE=true
```

## 2. Health check after deployment

Open:

```bash
/api/health
```

Expected behavior:

- `ok: true`
- `provider.configured: true` when a real API key is present
- `environment: "production"` on Vercel

## 3. Production recommendation

For real deployments:

- keep `ALLOW_DEMO_MODE=false`
- use a real provider key
- set strong admin credentials
- never commit `.env.local` or production keys into Git

## 4. Open-source safety

Before publishing on GitHub:

- keep only placeholders in `.env.example`
- confirm no real keys are present in tracked files
- run:

```bash
npm run security:scan
```
