export default function Card({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
      {title && (
        <h2 className="mb-5 text-xl font-bold text-night">
          {title}
        </h2>
      )}

      {children}
    </div>
  );
}
