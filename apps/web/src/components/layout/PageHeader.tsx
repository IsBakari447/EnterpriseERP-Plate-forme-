import Button from "@/components/ui/Button";

export default function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: string;
}) {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold text-night">{title}</h1>
        <p className="mt-1 text-slate-500">{subtitle}</p>
      </div>

      {action && <Button>{action}</Button>}
    </header>
  );
}
