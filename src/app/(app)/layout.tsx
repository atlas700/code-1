import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { SignOut } from "@/auth/components";
import { requireSession } from "@/auth/server";
import { getTenantContext } from "@/db/tenant";
import { T } from "gt-next";
import { Brand } from "@/components/workspace";
import { LocalePicker } from "@/app/_components/locale-picker";
import { AppNavigation, WorkspaceLocation } from "./_components/app-navigation";

type AppLayoutProps = {
  children: ReactNode;
};

export default async function AppLayout({ children }: AppLayoutProps) {
  await requireSession();
  if (!await getTenantContext()) redirect("/onboarding");
  return (
    <div className="min-h-dvh bg-page lg:grid lg:grid-cols-[15.5rem_minmax(0,1fr)]">
      <a
        className="sr-only rounded bg-primary px-4 py-3 font-semibold text-on-primary focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        href="#main-content"
      >
        Skip to content
      </a>
      <aside className="sticky top-0 hidden h-dvh border-e border-border/70 bg-[#eeeef1] lg:flex lg:flex-col">
        <Link
          className="px-6 py-8 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-ring"
          href="/dashboard"
        >
          <Brand />
        </Link>
        <div className="flex-1 px-4 py-3">
          <p className="mb-3 px-3 text-[11px] font-medium text-ink-muted"><T>Your business</T></p>
          <AppNavigation />
        </div>
        <div className="mx-4 border-t border-border px-2 py-5">
          <p className="mb-3 text-xs leading-5 text-ink-muted"><T>Agricultural supply chain</T></p>
          <SignOut />
        </div>
      </aside>
      <div className="min-w-0">
        <header className="border-b border-border/70 bg-page lg:hidden">
          <div className="flex items-center justify-between gap-3 pe-4 sm:pe-6">
            <Link
              className="flex min-h-16 items-center px-4 text-base font-semibold tracking-tight text-ink focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring sm:px-6"
              href="/dashboard"
            >
              <Brand compact />
            </Link>
            <SignOut />
          </div>
          <div className="overflow-x-auto px-4 pb-3 sm:px-6">
            <AppNavigation compact />
          </div>
        </header>
        <div className="flex min-h-[4.5rem] items-center justify-between gap-3 border-b border-border/70 bg-surface/70 px-4 sm:px-7 lg:px-10">
          <WorkspaceLocation />
          <LocalePicker />
        </div>
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-7xl px-4 py-7 outline-none sm:px-7 sm:py-10 lg:px-10"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
