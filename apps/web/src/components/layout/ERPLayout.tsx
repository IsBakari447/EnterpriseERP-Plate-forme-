import Sidebar from "./Sidebar";
import PageHeader from "./PageHeader";

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

      <section className="ml-72 p-10">
        <PageHeader title={title} subtitle={subtitle} action={action} />
        {children}
      </section>
    </main>
  );
}
