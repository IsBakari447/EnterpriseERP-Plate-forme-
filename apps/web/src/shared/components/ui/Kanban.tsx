export type KanbanCard = {
  title: string;
  subtitle?: string;
  amount?: string;
  meta?: string;
};

export type KanbanColumn = {
  title: string;
  cards: KanbanCard[];
};

export default function Kanban({ columns }: { columns: KanbanColumn[] }) {
  return (
    <section className="overflow-x-auto rounded-2xl bg-white p-5 shadow ring-1 ring-slate-200">
      <div className="flex min-w-[920px] gap-4">
        {columns.map((column) => (
          <div key={column.title} className="w-72 shrink-0 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-black text-night">{column.title}</h3>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-slate-500 ring-1 ring-slate-200">
                {column.cards.length}
              </span>
            </div>

            <div className="space-y-3">
              {column.cards.map((card) => (
                <article key={`${column.title}-${card.title}`} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                  <h4 className="font-black text-night">{card.title}</h4>
                  {card.subtitle && <p className="mt-1 text-sm text-slate-500">{card.subtitle}</p>}
                  <div className="mt-3 flex items-center justify-between gap-3 text-xs font-bold text-slate-500">
                    {card.amount && <span>{card.amount}</span>}
                    {card.meta && <span>{card.meta}</span>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
