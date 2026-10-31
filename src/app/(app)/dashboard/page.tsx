import type { Metadata } from "next";
import { getWorkspaceSummary } from "@/db/workspace";
import { hasPermission } from "@/auth/permissions";
import Link from "next/link";
import { T } from "gt-next";
import { ArrowUpRight, Package, Scale, Users, Boxes, ShoppingCart, Banknote } from "lucide-react";
import { PageHeader, Panel } from "@/components/workspace";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const { role } = await getWorkspaceSummary();
  return (
    <div className="space-y-8">
      <PageHeader eyebrow={<T>Your workspace</T>} title={<T>Overview</T>} description={<T>Keep your products, measures, and people in order.</T>} action={<Button asChild><Link href="/products"><Package aria-hidden="true" /><T>Open products</T></Link></Button>} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Panel className="overflow-hidden p-0 sm:p-0" aria-labelledby="workspace-essentials">
          <div className="border-b border-border/70 px-6 py-5"><h2 id="workspace-essentials" className="font-semibold"><T>Workspace essentials</T></h2><p className="mt-1 text-sm leading-6 text-ink-muted"><T>The foundations of your daily work.</T></p></div>
          <div className="divide-y divide-border/60">
            <Link href="/products" prefetch={false} className="group flex items-center gap-4 px-6 py-6 transition-colors hover:bg-page">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/8 text-primary"><Package className="size-5" aria-hidden="true" /></span>
              <div className="min-w-0 flex-1"><h3 className="text-sm font-semibold"><T>Products</T></h3><p className="mt-1 text-sm leading-6 text-ink-muted"><T>Add and organize the goods you trade.</T></p></div><ArrowUpRight className="size-4 shrink-0 text-ink-muted group-hover:text-primary rtl:-scale-x-100" aria-hidden="true" />
            </Link>
            <Link href="/settings/catalog" prefetch={false} className="group flex items-center gap-4 px-6 py-6 transition-colors hover:bg-page">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-success/8 text-success"><Scale className="size-5" aria-hidden="true" /></span>
              <div className="min-w-0 flex-1"><h3 className="text-sm font-semibold"><T>Units & categories</T></h3><p className="mt-1 text-sm leading-6 text-ink-muted"><T>Set up the measures your business uses.</T></p></div><ArrowUpRight className="size-4 shrink-0 text-ink-muted group-hover:text-primary rtl:-scale-x-100" aria-hidden="true" />
            </Link>
            {hasPermission(role, "staff.read") && <Link href="/settings/staff" prefetch={false} className="group flex items-center gap-4 px-6 py-6 transition-colors hover:bg-page">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#f3edf9] text-[#7950a3]"><Users className="size-5" aria-hidden="true" /></span>
              <div className="min-w-0 flex-1"><h3 className="text-sm font-semibold"><T>People & access</T></h3><p className="mt-1 text-sm leading-6 text-ink-muted"><T>Manage staff and their business roles.</T></p></div><ArrowUpRight className="size-4 shrink-0 text-ink-muted group-hover:text-primary rtl:-scale-x-100" aria-hidden="true" />
            </Link>}
          </div>
        </Panel>
        <Panel className="flex flex-col" aria-labelledby="daily-operations">
          <span className="mb-5 w-fit rounded-full border border-border px-2.5 py-1 text-xs text-ink-muted"><T>Coming soon</T></span>
          <h2 id="daily-operations" className="text-lg font-semibold"><T>Your trading day, connected.</T></h2>
          <p className="mt-3 text-sm leading-7 text-ink-muted"><T>Purchases, stock, and supplier payments will come together here as these workflows become available.</T></p>
          <ul className="mt-7 space-y-5 border-t border-border/70 pt-6 text-sm text-ink-muted">
            <li className="flex items-center gap-3"><ShoppingCart className="size-4" aria-hidden="true" /><T>Purchase & receive goods</T></li>
            <li className="flex items-center gap-3"><Boxes className="size-4" aria-hidden="true" /><T>Track stock on hand</T></li>
            <li className="flex items-center gap-3"><Banknote className="size-4" aria-hidden="true" /><T>Reconcile supplier payments</T></li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
