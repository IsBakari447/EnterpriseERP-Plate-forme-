import MarketingFooter from "@shared/components/marketing/MarketingFooter";
import MarketingHeader from "@shared/components/marketing/MarketingHeader";

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-[#F4F7FB] text-[#102033]">
      <MarketingHeader />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#00A693]">Confiance</p>
        <h1 className="mt-4 text-4xl font-black">Mentions legales EnterpriseERP Cloud</h1>
        <div className="mt-8 space-y-5 rounded-3xl bg-white p-8 leading-8 shadow ring-1 ring-slate-200">
          <p>EnterpriseERP Cloud est une plateforme SaaS ERP en phase de developpement et de pilote prive.</p>
          <p>Editeur: EnterpriseERP. Contact support et demandes commerciales: support@enterpriseerp.cloud.</p>
          <p>Hebergement: services cloud deployes sur Render, avec API et base de donnees separees.</p>
          <p>Ces informations doivent etre validees juridiquement avant lancement commercial public.</p>
        </div>
      </section>
      <MarketingFooter />
    </main>
  );
}
