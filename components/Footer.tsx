import Link from "next/link";
import { Sprout } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-farm-green text-white">
              <Sprout className="h-5 w-5" />
            </span>
            <span className="font-serif text-xl font-bold text-gray-900">Jeevadhara</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm text-gray-500">
            AI-operated, direct farmer-to-consumer marketplace piloting in Solipeta village,
            Telangana. Built for the Build with Gemini XPRIZE.
          </p>
        </div>
        <div>
          <h4 className="font-serif text-sm font-semibold text-gray-900">Marketplace</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-500">
            <li><Link href="/marketplace" className="hover:text-farm-green">Browse products</Link></li>
            <li><Link href="/marketplace?category=produce" className="hover:text-farm-green">Sell with us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif text-sm font-semibold text-gray-900">Project</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-500">
            <li><a href="https://xprize.devpost.com" className="hover:text-farm-green">Build with Gemini XPRIZE</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-gray-400 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Jeevadhara. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
