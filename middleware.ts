import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ADMIN_PATH_PREFIXES = ["/admin", "/api/admin"];

function isAdminPath(pathname: string) {
  return ADMIN_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function getConfiguredAdminCredentials() {
  const username = process.env.ADMIN_BASIC_AUTH_USER;
  const password = process.env.ADMIN_BASIC_AUTH_PASSWORD;

  if (!username || !password) {
    return null;
  }

  return { username, password };
}

function unauthorizedResponse(isApiRequest: boolean) {
  const headers = new Headers({
    "WWW-Authenticate": 'Basic realm="Eunoia Admin", charset="UTF-8"',
  });

  if (isApiRequest) {
    headers.set("Content-Type", "application/json");
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers,
    });
  }

  return new NextResponse("Unauthorized", {
    status: 401,
    headers,
  });
}

function decodeBasicAuth(headerValue: string) {
  if (!headerValue.startsWith("Basic ")) {
    return null;
  }

  try {
    const decoded = atob(headerValue.slice("Basic ".length));
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return null;
    }

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isAdminPath(pathname)) {
    return NextResponse.next();
  }

  const configuredCredentials = getConfiguredAdminCredentials();

  if (!configuredCredentials) {
    if (process.env.NODE_ENV === "production") {
      return new NextResponse("Admin access is not configured.", { status: 503 });
    }

    return NextResponse.next();
  }

  const providedCredentials = decodeBasicAuth(
    request.headers.get("authorization") || "",
  );

  if (
    !providedCredentials ||
    providedCredentials.username !== configuredCredentials.username ||
    providedCredentials.password !== configuredCredentials.password
  ) {
    return unauthorizedResponse(pathname.startsWith("/api/"));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
