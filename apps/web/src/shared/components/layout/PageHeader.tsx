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
    <header className="mb-6 flex flex-col justify-between gap-4 lg:mb-8 lg:flex-row lg:items-center">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold leading-tight text-night sm:text-3xl lg:text-4xl">
          {title}
        </h1>

        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
          {subtitle}
        </p>
      </div>

      <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 sm:gap-3 lg:overflow-visible lg:pb-0">
        <CommandPalette />

        <NotificationCenter />

        {action && onAction && (
          <Button onClick={onAction}>
            {action}
          </Button>
        )}

        {action && !onAction && (
          <span className="rounded-xl bg-action px-6 py-3 font-semibold text-white shadow-lg">
            {action}
          </span>
        )}

        <UserMenu />
      </div>
    </header>
  );
}
