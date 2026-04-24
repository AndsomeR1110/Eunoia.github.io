import { logoutAdminAction } from "@/app/admin/auth-actions";

export function AdminLogoutButton({ label }: { label: string }) {
  return (
    <form action={logoutAdminAction}>
      <button
        type="submit"
        className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-950"
      >
        {label}
      </button>
    </form>
  );
}
