import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { loginAdminAction } from "@/app/admin/auth-actions";
import {
  ADMIN_SESSION_COOKIE_NAME,
  hasValidAdminSession,
  getConfiguredAdminCredentials,
  getSafeAdminNextPath,
} from "@/lib/admin-auth";
import { getLocale, getServerDictionary } from "@/lib/server/locale";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string | string[];
    loggedOut?: string | string[];
    next?: string | string[];
  }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const locale = await getLocale();
  const dict = await getServerDictionary(locale);
  const params = await searchParams;
  const nextPath = getSafeAdminNextPath(readParam(params.next));
  const error = readParam(params.error);
  const loggedOut = readParam(params.loggedOut) === "1";
  const credentials = getConfiguredAdminCredentials();
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (await hasValidAdminSession(sessionToken, credentials)) {
    redirect(nextPath);
  }

  const loginCopy = dict.adminLogin;
  const errorMessage = getLoginErrorMessage(loginCopy, error, Boolean(credentials));
  const infoMessage = loggedOut ? loginCopy.loggedOut : null;

  return (
    <div className="min-h-dvh bg-slate-50 px-4 py-8 text-slate-900">
      <section className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-md items-center">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-slate-400">Eunoia</div>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">
            {loginCopy.formTitle}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{loginCopy.formDescription}</p>

            {errorMessage ? (
              <div className="mt-5 rounded-3xl border border-red-200 bg-red-50 px-4 py-4 text-sm leading-6 text-red-800">
                {errorMessage}
              </div>
            ) : null}

            {infoMessage ? (
              <div className="mt-5 rounded-3xl border border-cyan-200 bg-cyan-50 px-4 py-4 text-sm leading-6 text-cyan-900">
                {infoMessage}
              </div>
            ) : null}

            <form action={loginAdminAction} className="mt-6 space-y-4">
              <input type="hidden" name="next" value={nextPath} />

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {loginCopy.usernameLabel}
                </span>
                <input
                  type="text"
                  name="username"
                  required
                  autoComplete="username"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {loginCopy.passwordLabel}
                </span>
                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
                />
              </label>

              <button
                type="submit"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {loginCopy.submit}
              </button>
            </form>

          <div className="mt-6 text-sm leading-7 text-slate-500">
            <Link href="/" className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-4">
              {loginCopy.backToSite}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function readParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function getLoginErrorMessage(
  copy: {
    missingConfig: string;
    invalidCredentials: string;
  },
  error: string | undefined,
  credentialsConfigured: boolean,
) {
  if (!credentialsConfigured || error === "config") {
    return copy.missingConfig;
  }

  if (error === "invalid") {
    return copy.invalidCredentials;
  }

  return null;
}

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};
