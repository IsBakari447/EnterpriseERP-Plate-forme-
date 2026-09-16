"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@shared/components/layout/Sidebar";
import PageHeader from "@shared/components/layout/PageHeader";
import MobileShell from "@shared/components/layout/MobileShell";
import { tokenStorage } from "@shared/auth/token-storage";

export default function ERPLayout({
  title,
  subtitle,
  action,
  onAction,
  children,
}: {
  title: string;
  subtitle: string;
  action?: string;
  onAction?: () => void;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const session = tokenStorage.get();

    if (!session?.accessToken) {
      const redirect = pathname && pathname !== "/" ? `?redirect=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${redirect}`);
      return;
    }

    setIsAllowed(true);
  }, [pathname, router]);

  if (!isAllowed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F7FB] px-6">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-sm font-black text-slate-600 shadow-sm">
          Chargement de votre espace EnterpriseERP...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F7FB]">
      <Sidebar />
      <MobileShell />

      <section className="w-full overflow-x-hidden px-4 py-5 sm:px-5 lg:ml-64 lg:p-8 xl:p-10">
        <PageHeader
          title={title}
          subtitle={subtitle}
          action={action}
          onAction={onAction}
        />

        {children}
      </section>
    </main>
  );
}
