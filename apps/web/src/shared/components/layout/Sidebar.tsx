import Link from "next/link";
import { navigationItems } from "@config/navigation";

export default function Sidebar() {
  return (
    <aside className="sticky top-0 z-20 bg-night p-4 text-white lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-72 lg:p-6">
      <div className="mb-4 flex items-center justify-between gap-4 lg:mb-10 lg:block">
        <Link href="/" className="block">
          <img
            src="/enterpriseerp-logo.png"
            alt="EnterpriseERP"
            className="mb-0 h-14 w-36 rounded-2xl bg-white object-contain p-2 lg:mb-4 lg:h-24 lg:w-full"
          />
          <div className="hidden text-2xl font-bold lg:block">EnterpriseERP</div>
          <div className="hidden text-sm text-turquoise lg:block">Cloud AI Mobile</div>
        </Link>
      </div>

      <nav className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-3 lg:overflow-visible lg:pb-0">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-white/10 hover:text-turquoise lg:block lg:text-base"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
