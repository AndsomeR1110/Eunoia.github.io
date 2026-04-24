import { z } from "zod";

const rawServerEnv = {
  NODE_ENV: process.env.NODE_ENV,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
  OPENAI_MODEL: process.env.OPENAI_MODEL,
  OPENAI_ENABLE_THINKING: process.env.OPENAI_ENABLE_THINKING,
  OPENAI_TIMEOUT_MS: process.env.OPENAI_TIMEOUT_MS,
  ALLOW_DEMO_MODE: process.env.ALLOW_DEMO_MODE,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  ADMIN_BASIC_AUTH_USER: process.env.ADMIN_BASIC_AUTH_USER,
  ADMIN_BASIC_AUTH_PASSWORD: process.env.ADMIN_BASIC_AUTH_PASSWORD,
};

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  OPENAI_API_KEY: z.string().trim().min(1).optional(),
  OPENAI_BASE_URL: z.string().trim().url().optional(),
  OPENAI_MODEL: z.string().trim().min(1).optional(),
  OPENAI_ENABLE_THINKING: z.enum(["true", "false"]).optional(),
  OPENAI_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).optional(),
  ALLOW_DEMO_MODE: z.enum(["true", "false"]).optional(),
  NEXT_PUBLIC_APP_URL: z.string().trim().url().optional(),
  ADMIN_BASIC_AUTH_USER: z.string().trim().min(1).optional(),
  ADMIN_BASIC_AUTH_PASSWORD: z.string().trim().min(1).optional(),
});

const parsedServerEnv = serverEnvSchema.safeParse(rawServerEnv);

if (!parsedServerEnv.success) {
  throw new Error(
    `Invalid server environment variables: ${parsedServerEnv.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ")}`,
  );
}

const env = parsedServerEnv.data;

export const serverEnv = {
  nodeEnv: env.NODE_ENV,
  openAiApiKey: env.OPENAI_API_KEY,
  openAiBaseUrl:
    env.OPENAI_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1",
  openAiModel: env.OPENAI_MODEL || "qwen3.6-flash-2026-04-16",
  openAiEnableThinking: env.OPENAI_ENABLE_THINKING
    ? env.OPENAI_ENABLE_THINKING === "true"
    : false,
  openAiTimeoutMs: env.OPENAI_TIMEOUT_MS || 60000,
  allowDemoMode: env.ALLOW_DEMO_MODE ? env.ALLOW_DEMO_MODE === "true" : true,
  appUrl: env.NEXT_PUBLIC_APP_URL,
  adminBasicAuthUser: env.ADMIN_BASIC_AUTH_USER,
  adminBasicAuthPassword: env.ADMIN_BASIC_AUTH_PASSWORD,
};

export function getAdminBasicAuth() {
  if (!serverEnv.adminBasicAuthUser || !serverEnv.adminBasicAuthPassword) {
    return null;
  }

  return {
    username: serverEnv.adminBasicAuthUser,
    password: serverEnv.adminBasicAuthPassword,
  };
}

export function isProduction() {
  return serverEnv.nodeEnv === "production";
}

export function isProviderConfigured() {
  return Boolean(serverEnv.openAiApiKey);
}
