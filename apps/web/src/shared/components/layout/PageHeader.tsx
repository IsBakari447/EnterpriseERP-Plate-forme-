import Button from "@shared/components/ui/Button";
import CommandPalette from "./CommandPalette";
import NotificationCenter from "./NotificationCenter";
import UserMenu from "./UserMenu";

export default function PageHeader({
  title,
  subtitle,
  action,
  onAction,
}: {
  title: string;
  subtitle: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <header className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
      <div>
        <h1 className="text-3xl font-bold text-night lg:text-4xl">
          {title}
        </h1>

        <p className="mt-1 text-slate-500">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <CommandPalette />

        <NotificationCenter />

        {action && (
          <Button onClick={onAction}>
            {action}
          </Button>
        )}

        <UserMenu />
      </div>
    </header>
  );
}
