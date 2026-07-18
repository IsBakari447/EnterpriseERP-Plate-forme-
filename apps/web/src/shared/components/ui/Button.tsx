export default function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="rounded-xl bg-action px-6 py-3 font-semibold text-white shadow-lg hover:opacity-90">
      {children}
    </button>
  );
}
