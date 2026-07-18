import Sidebar from "@shared/components/layout/Sidebar";
import PageHeader from "@shared/components/layout/PageHeader";

export default function ERPLayout({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle: string;
  action?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#F4F7FB]">
      <Sidebar />

      <section className="p-5 lg:ml-72 lg:p-10">
        <PageHeader title={title} subtitle={subtitle} action={action} />
        {children}
      </section>
    </main>
  );
}
