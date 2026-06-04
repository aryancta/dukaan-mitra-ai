"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mic, Settings, Store } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/settings", label: "Settings" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-saffron-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-teal-950">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-saffron-500 text-white">
            <Store className="h-4 w-4" />
          </span>
          Dukaan Mitra
        </Link>
        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === l.href
                  ? "bg-saffron-100 text-saffron-900"
                  : "text-teal-800 hover:bg-saffron-50"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 rounded-lg bg-saffron-600 px-3 py-2 text-sm font-medium text-white hover:bg-saffron-700 sm:hidden"
        >
          <Mic className="h-4 w-4" />
          Demo
        </Link>
        <Link
          href="/settings"
          className="hidden rounded-lg p-2 text-teal-800 hover:bg-saffron-50 sm:inline-flex"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
}
