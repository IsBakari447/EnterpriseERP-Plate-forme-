import Button from "@shared/components/ui/Button";

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
    <header className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
      <div>
        <h1 className="text-3xl font-bold text-night lg:text-4xl">{title}</h1>
        <p className="mt-1 text-slate-500">{subtitle}</p>
      </div>

      {action && <Button>{action}</Button>}
    </header>
  );
}
