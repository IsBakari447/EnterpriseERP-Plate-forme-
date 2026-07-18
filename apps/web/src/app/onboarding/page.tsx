import { onboardingSteps } from "@modules/cloud-market/data";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-[#F4F7FB] px-6 py-16 text-night lg:px-16">
      <section className="mx-auto max-w-6xl">
        <span className="rounded-full bg-[#FF7A00]/10 px-4 py-2 text-sm font-black text-[#C75E00]">
          Customer Success
        </span>
        <h1 className="mt-6 text-5xl font-black">Un onboarding simple pour convertir les essais gratuits.</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Le produit devient plus attractif quand le client comprend exactement
          comment passer de la creation du compte aux premieres donnees utiles.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {onboardingSteps.map((step) => (
            <article key={step.title} className="rounded-3xl bg-white p-7 shadow ring-1 ring-slate-200">
              <h2 className="text-2xl font-black">{step.title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{step.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
