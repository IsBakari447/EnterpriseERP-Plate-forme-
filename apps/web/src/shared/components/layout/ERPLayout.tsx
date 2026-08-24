"use client";

import Sidebar from "@shared/components/layout/Sidebar";
import PageHeader from "@shared/components/layout/PageHeader";

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

      <section className="p-5 lg:ml-64 lg:p-8 xl:p-10">
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
