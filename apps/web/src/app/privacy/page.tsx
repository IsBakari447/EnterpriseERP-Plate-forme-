import MarketingFooter from "@shared/components/marketing/MarketingFooter";
import MarketingHeader from "@shared/components/marketing/MarketingHeader";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F4F7FB] text-[#102033]">
      <MarketingHeader />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#00A693]">Donnees</p>
        <h1 className="mt-4 text-4xl font-black">Politique de confidentialite</h1>
        <div className="mt-8 space-y-5 rounded-3xl bg-white p-8 leading-8 shadow ring-1 ring-slate-200">
          <p>EnterpriseERP Cloud collecte les donnees necessaires a la creation de compte, a la gestion de l'espace entreprise et au support.</p>
          <p>Les donnees metier sont separees par entreprise et utilisees pour fournir les modules ERP actives.</p>
          <p>Les utilisateurs peuvent demander export, correction ou suppression des donnees selon les obligations applicables.</p>
          <p>Ce texte est une base produit et doit etre valide par un conseil juridique avant commercialisation.</p>
        </div>
      </section>
      <MarketingFooter />
    </main>
  );
}
