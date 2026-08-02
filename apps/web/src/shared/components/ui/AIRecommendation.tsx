export default function AIRecommendation({
  title = "Recommandation IA",
  text,
  actions = [],
}: {
  title?: string;
  text: string;
  actions?: string[];
}) {
  return (
    <section className="rounded-2xl bg-[#1E2A38] p-6 text-white shadow ring-1 ring-slate-800">
      <div className="inline-flex rounded-full bg-[#00C2A9]/15 px-3 py-1 text-xs font-black text-[#00C2A9]">
        IA
      </div>
      <h2 className="mt-4 text-xl font-black">{title}</h2>
      <p className="mt-3 leading-7 text-white/75">{text}</p>
      {actions.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {actions.map((action) => (
            <span key={action} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white">
              {action}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
