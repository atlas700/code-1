"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/inventory", label: "Inventory" },
  { href: "/purchases", label: "Purchases" },
  { href: "/sales", label: "Sales" },
  { href: "/payments", label: "Payments" },
  { href: "/settings", label: "Settings" },
] as const;

type AppNavigationProps = {
  compact?: boolean;
};

export function AppNavigation({ compact = false }: AppNavigationProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation">
      <ul className={compact ? "flex gap-2" : "space-y-1"}>
        {navigationItems.map(({ href, label }) => {
          const isCurrent = pathname === href;

          return (
            <li key={href} className={compact ? "shrink-0" : undefined}>
              <Link
                aria-current={isCurrent ? "page" : undefined}
                className={`flex min-h-11 items-center rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  compact
                    ? isCurrent
                      ? "bg-primary text-on-primary"
                      : "border border-border bg-surface text-ink hover:bg-muted"
                    : isCurrent
                      ? "bg-primary text-on-primary"
                      : "text-ink hover:bg-muted"
                }`}
                href={href}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
