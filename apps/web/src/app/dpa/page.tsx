import MarketingFooter from "@shared/components/marketing/MarketingFooter";
import MarketingHeader from "@shared/components/marketing/MarketingHeader";

export default function DpaPage() {
  return (
    <main className="min-h-screen bg-[#F4F7FB] text-[#102033]">
      <MarketingHeader />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#00A693]">RGPD</p>
        <h1 className="mt-4 text-4xl font-black">DPA et traitement des donnees</h1>
        <div className="mt-8 space-y-5 rounded-3xl bg-white p-8 leading-8 shadow ring-1 ring-slate-200">
          <p>EnterpriseERP Cloud agit comme plateforme de traitement pour les donnees ERP chargees par chaque entreprise cliente.</p>
          <p>Les engagements definitifs doivent couvrir sous-traitants, regions d'hebergement, mesures de securite, conservation, export et suppression.</p>
          <p>Le DPA complet doit etre finalise et approuve avant la vente en libre-service.</p>
        </div>
      </section>
      <MarketingFooter />
    </main>
  );
}
