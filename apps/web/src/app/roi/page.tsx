import { roiCards } from "@modules/cloud-market/data";

export default function RoiPage() {
  return (
    <main className="min-h-screen bg-[#F4F7FB] px-6 py-16 text-night lg:px-16">
      <section className="mx-auto max-w-6xl">
        <span className="rounded-full bg-[#1E2A38] px-4 py-2 text-sm font-black text-white">
          ROI Cloud
        </span>
        <h1 className="mt-6 text-5xl font-black">Montrer la valeur avant la vente.</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Une page ROI aide les clients a comprendre le gain: moins de temps
          administratif, meilleure relance, moins de donnees dispersees.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {roiCards.map((card) => (
            <article key={card.metric} className="rounded-3xl bg-white p-7 shadow ring-1 ring-slate-200">
              <h2 className="text-xl font-black">{card.metric}</h2>
              <div className="mt-5 space-y-3 text-sm font-bold text-slate-600">
                <p>Avant: {card.before}</p>
                <p>Apres: {card.after}</p>
              </div>
              <p className="mt-5 text-3xl font-black text-[#00A693]">{card.gain}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
