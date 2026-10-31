import type { Metadata } from "next";
import Link from "next/link";
import { T } from "gt-next";
import { getCatalogWorkspace } from "@/db/catalog";
import { CatalogForm } from "./_components/catalog-form";
import { ArrowLeft, Scale, Tags } from "lucide-react";
import { PageHeader, Panel, StatusBadge } from "@/components/workspace";

export const metadata: Metadata = { title: "Units and categories" };

export default async function CatalogPage() {
  const { units, categories, canManage } = await getCatalogWorkspace();
  return <div className="space-y-8">
    <div className="space-y-3">
      <Link href="/settings" className="inline-flex min-h-11 items-center gap-2 text-sm text-ink-muted hover:text-primary"><ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" /><T>Settings</T></Link>
      <PageHeader title={<T>Units and product categories</T>} description={<T>The measures and groups behind your catalogue. Stock uses kilograms, accurate to one gram.</T>} />
      {!canManage && <p className="rounded-xl bg-muted/60 px-4 py-3 text-sm text-ink-muted"><T>Only owners, admins, and managers can change these entries.</T></p>}
    </div>
    <section aria-labelledby="catalog-units" className="space-y-4">
      <h2 id="catalog-units" className="flex items-center gap-2 text-lg font-semibold"><Scale className="size-5 text-ink-muted" aria-hidden="true" /><T>Weight units</T></h2>
      <details className="rounded-xl bg-muted/50 px-4 py-2"><summary className="min-h-11 content-center text-sm font-medium"><T>About local weight measures</T></summary><p className="max-w-3xl pb-3 text-sm leading-7 text-ink-muted"><T>Pilot weights: 1 maan = 4.4 kg; 1 khorwar = 100 maan = 440 kg. Bags use their actual weight: 10 maan is 44 kg and 11 maan is 48.4 kg. Changes apply to future entries; past goods retain their recorded weights.</T></p></details>
      {canManage && <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-sm font-semibold"><T>Add a weight unit</T></h3><CatalogForm entity="defaults" /></div>
        <CatalogForm entity="unit" />
      </Panel>}
      {units.length === 0 && <p className="rounded-2xl border border-border/70 bg-surface p-8 text-center text-sm text-ink-muted"><T>No weight units yet.</T></p>}
      <ul className="divide-y divide-border/70 overflow-hidden rounded-2xl border border-border/70 bg-surface empty:hidden">{units.map((unit) => <li key={unit.id} className="space-y-3 px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3"><div className="min-w-0"><h3 className="break-words text-sm font-semibold" dir="auto">{unit.name}</h3>
        <p className="mt-1 text-sm text-ink-muted">{unit.kind === "bag" ? <T>Actual weight per bag</T> : <T><bdi dir="ltr">{unit.kilogramsPerUnit}</bdi> kg per unit</T>}</p></div><StatusBadge active={unit.isActive} /></div>
        {canManage && unit.isActive && <details className="border-t border-border/60 pt-2"><summary className="min-h-11 content-center text-sm font-medium text-primary"><T>Edit unit</T></summary><div className="py-3"><CatalogForm key={`${unit.name}-${unit.kind}-${unit.kilogramsPerUnit}`} entity="unit" entry={unit} /></div></details>}
      </li>)}</ul>
    </section>
    <section aria-labelledby="catalog-categories" className="space-y-4">
      <h2 id="catalog-categories" className="flex items-center gap-2 text-lg font-semibold"><Tags className="size-5 text-ink-muted" aria-hidden="true" /><T>Product categories</T></h2>
      {canManage && <Panel><CatalogForm entity="category" /></Panel>}
      {categories.length === 0 && <p className="rounded-2xl border border-border/70 bg-surface p-8 text-center text-sm text-ink-muted"><T>No product categories yet.</T></p>}
      <ul className="divide-y divide-border/70 overflow-hidden rounded-2xl border border-border/70 bg-surface empty:hidden">{categories.map((category) => <li key={category.id} className="space-y-3 px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="break-words text-sm font-semibold" dir="auto">{category.name}</h3><StatusBadge active={category.isActive} /></div>
        {canManage && category.isActive && <details className="border-t border-border/60 pt-2"><summary className="min-h-11 content-center text-sm font-medium text-primary"><T>Edit category</T></summary><div className="py-3"><CatalogForm key={category.name} entity="category" entry={category} /></div></details>}
      </li>)}</ul>
    </section>
  </div>;
}
