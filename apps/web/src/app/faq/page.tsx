import { faqs } from "@modules/cloud-market/data";

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-[#F4F7FB] px-6 py-16 text-night lg:px-16">
      <section className="mx-auto max-w-5xl">
        <h1 className="text-5xl font-black">Questions frequentes</h1>
        <div className="mt-10 space-y-4">
          {faqs.map((faq) => (
            <article key={faq.question} className="rounded-3xl bg-white p-7 shadow ring-1 ring-slate-200">
              <h2 className="text-xl font-black">{faq.question}</h2>
              <p className="mt-3 leading-7 text-slate-600">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
