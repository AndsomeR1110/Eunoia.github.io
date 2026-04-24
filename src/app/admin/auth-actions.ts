"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_LOGIN_PATH,
  ADMIN_SESSION_COOKIE_NAME,
  createAdminSessionToken,
  getAdminSessionCookieOptions,
  getConfiguredAdminCredentials,
  getSafeAdminNextPath,
} from "@/lib/admin-auth";

export async function loginAdminAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = getSafeAdminNextPath(String(formData.get("next") ?? ""));
  const credentials = getConfiguredAdminCredentials();

  if (!credentials) {
    redirect(buildLoginRedirectUrl("config", nextPath));
  }

  if (
    username !== credentials.username ||
    password !== credentials.password
  ) {
    redirect(buildLoginRedirectUrl("invalid", nextPath));
  }

  const token = await createAdminSessionToken(credentials);
  const cookieStore = await cookies();

  cookieStore.set(
    ADMIN_SESSION_COOKIE_NAME,
    token,
    getAdminSessionCookieOptions(),
  );

  redirect(nextPath);
}

export async function logoutAdminAction() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, "", {
    ...getAdminSessionCookieOptions(),
    maxAge: 0,
  });
  redirect(`${ADMIN_LOGIN_PATH}?loggedOut=1`);
}

function buildLoginRedirectUrl(error: "config" | "invalid", nextPath: string) {
  const params = new URLSearchParams({ error });

  if (nextPath) {
    params.set("next", nextPath);
  }

  return `${ADMIN_LOGIN_PATH}?${params.toString()}`;
}
