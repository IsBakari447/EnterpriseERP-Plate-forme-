import { demoHighlights } from "@modules/cloud-market/data";

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#F4F7FB] px-6 py-16 text-night lg:px-16">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_.9fr]">
        <div>
          <span className="rounded-full bg-[#00C2A9]/10 px-4 py-2 text-sm font-black text-[#008f7d]">
            Demo Cloud
          </span>
          <h1 className="mt-6 text-5xl font-black">Une demo courte, claire et orientee decision.</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Les clients doivent comprendre rapidement comment EnterpriseERP Cloud
            reduit la dispersion des donnees, accelere la facturation et donne
            une vision dirigeant exploitable.
          </p>
          <div className="mt-8 grid gap-3">
            {demoHighlights.map((item) => (
              <div key={item} className="rounded-2xl bg-white p-5 font-bold shadow ring-1 ring-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>

        <form className="rounded-3xl bg-white p-7 shadow ring-1 ring-slate-200">
          <h2 className="text-2xl font-black">Demander une demo</h2>
          <label className="mt-5 block text-sm font-black text-slate-600">Nom</label>
          <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Votre nom" />
          <label className="mt-4 block text-sm font-black text-slate-600">Email professionnel</label>
          <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="vous@entreprise.com" />
          <label className="mt-4 block text-sm font-black text-slate-600">Besoin principal</label>
          <textarea className="mt-2 min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="CRM, facturation, stock, mobile, integrations..." />
          <button className="mt-5 w-full rounded-2xl bg-[#FF7A00] px-6 py-4 font-black text-white" type="button">
            Preparer ma demo
          </button>
          <p className="mt-3 text-sm text-slate-500">Formulaire vitrine pret a connecter a l'API lead/demo.</p>
        </form>
      </section>
    </main>
  );
}
