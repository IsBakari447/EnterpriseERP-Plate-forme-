import Link from "next/link";
import { navigationItems } from "@/config/navigation";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-night p-6 text-white">
      <div className="mb-10">
        <Link href="/" className="block">
          <img
            src="/enterpriseerp-logo.png"
            alt="EnterpriseERP"
            className="mb-4 h-24 w-full rounded-2xl bg-white object-contain p-2"
          />
          <div className="text-2xl font-bold">EnterpriseERP</div>
          <div className="text-sm text-turquoise">Cloud AI Mobile</div>
        </Link>
      </div>

      <nav className="space-y-3">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-xl px-4 py-3 font-medium transition hover:bg-white/10 hover:text-turquoise"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
