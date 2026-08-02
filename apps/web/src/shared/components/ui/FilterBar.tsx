"use client";

export type FilterOption = {
  label: string;
  value: string;
};

export default function FilterBar({
  searchPlaceholder = "Rechercher...",
  filters = [],
  actions,
}: {
  searchPlaceholder?: string;
  filters?: Array<{
    label: string;
    options: FilterOption[];
  }>;
  actions?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow ring-1 ring-slate-200">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
          <input
            placeholder={searchPlaceholder}
            className="min-h-11 w-full rounded-xl border border-slate-300 px-4 text-sm font-semibold outline-none focus:border-[#00C2A9] focus:ring-4 focus:ring-[#00C2A9]/15 md:max-w-sm"
          />

          {filters.map((filter) => (
            <label key={filter.label} className="flex flex-col gap-1 text-xs font-black uppercase tracking-wide text-slate-400 md:min-w-44">
              {filter.label}
              <select className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm font-bold normal-case tracking-normal text-slate-700 outline-none focus:border-[#00C2A9]">
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>

        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </section>
  );
}
