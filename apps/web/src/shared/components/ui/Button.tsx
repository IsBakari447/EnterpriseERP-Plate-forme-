"use client";

export default function Button({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick ?? (() => window.dispatchEvent(new CustomEvent("enterpriseerp:open-command-palette")))}
      className="rounded-xl bg-action px-6 py-3 font-semibold text-white shadow-lg hover:opacity-90"
    >
      {children}
    </button>
  );
}
