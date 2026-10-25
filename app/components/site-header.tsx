"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/", label: "Converter" },
  { href: "/decks", label: "Shared decks" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between gap-4">
      <nav
        aria-label="Main"
        className="flex items-center gap-1 rounded-xl bg-white/70 p-1 ring-1 ring-zinc-200 backdrop-blur dark:bg-zinc-900/70 dark:ring-zinc-800"
      >
        {links.map((link) => {
          const active =
            link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                active
                  ? "bg-emerald-600 text-white shadow-sm dark:bg-emerald-500 dark:text-zinc-950"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <ThemeToggle />
    </div>
  );
}
