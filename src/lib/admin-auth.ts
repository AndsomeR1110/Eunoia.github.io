export const ADMIN_LOGIN_PATH = "/admin/login";
export const DEFAULT_ADMIN_PATH = "/admin/content";
export const ADMIN_SESSION_COOKIE_NAME = "eunoia-admin-session";

export interface AdminCredentials {
  username: string;
  password: string;
}

export function getConfiguredAdminCredentials(): AdminCredentials | null {
  const username = process.env.ADMIN_BASIC_AUTH_USER;
  const password = process.env.ADMIN_BASIC_AUTH_PASSWORD;

  if (!username || !password) {
    return null;
  }

  return { username, password };
}

export function getSafeAdminNextPath(rawPath: string | null | undefined) {
  if (!rawPath || !rawPath.startsWith("/admin")) {
    return DEFAULT_ADMIN_PATH;
  }

  if (rawPath === ADMIN_LOGIN_PATH || rawPath.startsWith(`${ADMIN_LOGIN_PATH}?`)) {
    return DEFAULT_ADMIN_PATH;
  }

  return rawPath;
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  };
}

export async function createAdminSessionToken(credentials: AdminCredentials) {
  const encoder = new TextEncoder();
  const data = encoder.encode(
    `eunoia-admin:${credentials.username}:${credentials.password}`,
  );
  const digest = await crypto.subtle.digest("SHA-256", data);

  return toBase64Url(new Uint8Array(digest));
}

export async function hasValidAdminSession(
  token: string | undefined,
  credentials: AdminCredentials | null,
) {
  if (!token || !credentials) {
    return false;
  }

  const expectedToken = await createAdminSessionToken(credentials);
  return token === expectedToken;
}

function toBase64Url(bytes: Uint8Array) {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
