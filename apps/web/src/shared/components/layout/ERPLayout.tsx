"use client";

import Sidebar from "@shared/components/layout/Sidebar";
import PageHeader from "@shared/components/layout/PageHeader";
import MobileShell from "@shared/components/layout/MobileShell";

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
