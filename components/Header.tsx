import Link from "next/link";
import { Sprout } from "lucide-react";

const NAV_LINKS = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/mandi-rates", label: "Mandi Rates" },
  { href: "/egg-prices", label: "Egg Prices" },
  { href: "/jankari", label: "Expert Desk" },
  { href: "/farmer/list", label: "Sell Produce" },
  { href: "/auth", label: "Login" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-farm-green text-white">
            <Sprout className="h-5 w-5" />
          </span>
          <span className="font-serif text-xl font-bold text-gray-900">Jeevadhara</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-farm-green">
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/auth"
          className="inline-flex h-10 items-center rounded-lg bg-farm-green px-5 text-sm font-semibold text-white transition hover:bg-emerald-900"
        >
          Get started
        </Link>
      </div>
    </header>
  );
}
