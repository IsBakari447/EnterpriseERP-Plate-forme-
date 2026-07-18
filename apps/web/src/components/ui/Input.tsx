export default function Input({
  placeholder,
}: {
  placeholder?: string;
}) {
  return (
    <input
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500"
    />
  );
}
