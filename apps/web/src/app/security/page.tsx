import { securityItems } from "@modules/cloud-market/data";

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-[#F4F7FB] px-6 py-16 text-night lg:px-16">
      <section className="mx-auto max-w-6xl">
        <span className="rounded-full bg-[#1E2A38] px-4 py-2 text-sm font-black text-white">
          Trust Center
        </span>
        <h1 className="mt-6 text-5xl font-black">Securite, readiness et confiance Cloud.</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Un ERP Cloud doit rassurer les clients avant meme la demo: acces,
          readiness, donnees, audit et configuration par environnement.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {securityItems.map((item) => (
            <article key={item.title} className="rounded-3xl bg-white p-7 shadow ring-1 ring-slate-200">
              <h2 className="text-2xl font-black">{item.title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
