export default function KPICard({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change?: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-bold text-night">{value}</p>
      {change && (
        <p className="mt-2 text-sm font-semibold text-turquoise">{change}</p>
      )}
    </div>
  );
}
