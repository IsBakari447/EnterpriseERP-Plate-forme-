export default function EmptyState({
  title,
}: {
  title: string;
}) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-300 p-10 text-center">
      <h2 className="text-xl font-semibold text-slate-500">
        {title}
      </h2>
    </div>
  );
}
