import MarketingFooter from "@shared/components/marketing/MarketingFooter";
import MarketingHeader from "@shared/components/marketing/MarketingHeader";

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#F4F7FB] text-[#102033]">
      <MarketingHeader />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#00A693]">Cookies</p>
        <h1 className="mt-4 text-4xl font-black">Politique des cookies</h1>
        <div className="mt-8 space-y-5 rounded-3xl bg-white p-8 leading-8 shadow ring-1 ring-slate-200">
          <p>EnterpriseERP Cloud utilise des stockages techniques pour conserver la langue, la session et les preferences essentielles.</p>
          <p>Les cookies ou traceurs marketing doivent rester desactives tant qu'un consentement clair n'est pas mis en place.</p>
          <p>Les utilisateurs peuvent supprimer les donnees locales depuis leur navigateur.</p>
        </div>
      </section>
      <MarketingFooter />
    </main>
  );
}
