const modules = [
  { name: "Dashboard", href: "/" },
  { name: "CRM", href: "/crm" },
  { name: "Ventes", href: "/ventes" },
  { name: "Stock", href: "/stock" },
  { name: "Facturation", href: "/facturation" },
  { name: "Comptabilité", href: "/comptabilite" },
  { name: "RH", href: "/rh" },
  { name: "Assistant IA", href: "/assistant" },
];

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
      <aside className="fixed left-0 top-0 h-full w-72 bg-night p-6 text-white">
        <div className="mb-10">
          <img
            src="/enterpriseerp-logo.png"
            alt="EnterpriseERP"
            className="mb-4 h-24 w-full rounded-2xl bg-white object-contain p-2"
          />
          <div className="text-2xl font-bold">EnterpriseERP</div>
          <div className="text-sm text-turquoise">Cloud AI Mobile</div>
        </div>

        <nav className="space-y-3">
          {modules.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block rounded-xl px-4 py-3 font-medium transition hover:bg-white/10"
            >
              {item.name}
            </a>
          ))}
        </nav>
      </aside>

      <section className="ml-72 p-10">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-night">{title}</h1>
            <p className="mt-1 text-slate-500">{subtitle}</p>
          </div>

          {action && (
            <button className="rounded-xl bg-action px-6 py-3 font-semibold text-white shadow-lg hover:opacity-90">
              {action}
            </button>
          )}
        </header>

        {children}
      </section>
    </main>
  );
}
