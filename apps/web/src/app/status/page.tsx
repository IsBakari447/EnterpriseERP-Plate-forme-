import { platformStatus } from "@modules/cloud-market/data";

export default function StatusPage() {
  return (
    <main className="min-h-screen bg-[#F4F7FB] px-6 py-16 text-night lg:px-16">
      <section className="mx-auto max-w-5xl">
        <span className="rounded-full bg-[#1E2A38] px-4 py-2 text-sm font-black text-white">
          Platform status
        </span>
        <h1 className="mt-6 text-5xl font-black">Etat des services EnterpriseERP Cloud.</h1>
        <div className="mt-10 space-y-4">
          {platformStatus.map((item) => (
            <article key={item.service} className="flex flex-col justify-between gap-4 rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200 md:flex-row md:items-center">
              <div>
                <h2 className="text-xl font-black">{item.service}</h2>
                <p className="mt-2 text-slate-600">{item.detail}</p>
              </div>
              <span className="rounded-full bg-[#00C2A9]/10 px-4 py-2 text-sm font-black text-[#008f7d]">
                {item.status}
              </span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
