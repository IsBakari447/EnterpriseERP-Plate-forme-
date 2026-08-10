"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authService } from "@modules/auth/services/auth.service";
import { tokenStorage, type AuthUser } from "@shared/auth/token-storage";
import { useI18n } from "@shared/i18n/I18nProvider";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    setUser(tokenStorage.get()?.user ?? null);
  }, []);

  const initials = (user?.name ?? "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function logout() {
    await authService.logout();
    window.location.href = "/login";
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2 shadow ring-1 ring-slate-200"
      >
        <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#1E2A38] text-sm font-black text-white">
          {user?.avatarUrl ? <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" /> : initials}
        </span>
        <span className="hidden text-left md:block">
          <span className="block text-sm font-black text-night">{user?.name ?? t("common.user")}</span>
          <span className="block text-xs font-bold text-slate-400">{user?.role ?? t("common.role")}</span>
        </span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-72 rounded-3xl bg-white p-3 shadow-xl ring-1 ring-slate-200">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-black text-night">{user?.name ?? t("common.user")}</p>
            <p className="text-sm font-semibold text-slate-500">{user?.email}</p>
            <p className="mt-1 text-xs font-black uppercase tracking-wide text-[#00A693]">{user?.role ?? t("common.role")}</p>
          </div>
          <div className="mt-3 space-y-1">
            {[
              [t("account.profile"), "/profile"],
              [t("account.security"), "/account/security"],
              [t("account.sessions"), "/account/sessions"],
              [t("account.preferences"), "/account/preferences"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="block rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">
                {label}
              </Link>
            ))}
          </div>
          <div className="my-2 border-t border-slate-100" />
          <button
            type="button"
            onClick={logout}
            className="w-full rounded-xl px-4 py-2.5 text-left text-sm font-black text-red-600 hover:bg-red-50"
          >
            {t("auth.logout")}
          </button>
        </div>
      )}
    </div>
  );
}
