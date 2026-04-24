import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  ADMIN_LOGIN_PATH,
  ADMIN_SESSION_COOKIE_NAME,
  hasValidAdminSession,
  getConfiguredAdminCredentials,
} from "@/lib/admin-auth";

const ADMIN_PATH_PREFIXES = ["/admin", "/api/admin"];

function isAdminPath(pathname: string) {
  return ADMIN_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isPublicAdminPath(pathname: string) {
  return pathname === ADMIN_LOGIN_PATH;
}

function unauthorizedResponse(isApiRequest: boolean, loginUrl?: string) {
  if (isApiRequest) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return NextResponse.redirect(loginUrl || ADMIN_LOGIN_PATH);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isAdminPath(pathname)) {
    return NextResponse.next();
  }

  if (isPublicAdminPath(pathname)) {
    return NextResponse.next();
  }

  const configuredCredentials = getConfiguredAdminCredentials();

  if (!configuredCredentials) {
    if (process.env.NODE_ENV === "production") {
      return new NextResponse("Admin access is not configured.", { status: 503 });
    }

    return NextResponse.next();
  }

  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (await hasValidAdminSession(sessionToken, configuredCredentials)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return unauthorizedResponse(true);
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = ADMIN_LOGIN_PATH;
  loginUrl.search = "";
  loginUrl.searchParams.set(
    "next",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );

  return unauthorizedResponse(false, loginUrl.toString());
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
