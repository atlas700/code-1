import Link from "next/link";
import type { ReactNode } from "react";
import { SignOut } from "@/auth/components";
import { AppNavigation } from "./_components/app-navigation";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-page lg:grid lg:grid-cols-[16rem_1fr]">
      <a
        className="sr-only rounded bg-primary px-4 py-3 font-semibold text-on-primary focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        href="#main-content"
      >
        Skip to content
      </a>
      <aside className="hidden border-r border-border bg-surface lg:flex lg:flex-col">
        <Link
          className="border-b border-border px-6 py-6 text-lg font-semibold tracking-tight text-ink focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
          href="/dashboard"
        >
          Agricultural Supply Chain
        </Link>
        <div className="flex-1 px-3 py-5">
          <AppNavigation />
        </div>
        <div className="border-t border-border px-6 py-5">
          <SignOut />
        </div>
      </aside>
      <div className="min-w-0">
        <header className="border-b border-border bg-surface lg:hidden">
          <div className="flex items-center justify-between gap-3 pe-4 sm:pe-6">
            <Link
              className="flex min-h-16 items-center px-4 text-base font-semibold tracking-tight text-ink focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring sm:px-6"
              href="/dashboard"
            >
              Agricultural Supply Chain
            </Link>
            <SignOut />
          </div>
          <div className="overflow-x-auto px-4 pb-3 sm:px-6">
            <AppNavigation compact />
          </div>
        </header>
        <main
          id="main-content"
          className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
