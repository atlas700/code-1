import type { Metadata } from "next";
import Link from "next/link";
import { T } from "gt-next";
import { getCatalogWorkspace } from "@/db/catalog";
import { CatalogForm } from "./_components/catalog-form";

export const metadata: Metadata = { title: "Units and categories" };

export default async function CatalogPage() {
  const { units, categories, canManage } = await getCatalogWorkspace();
  return <div className="space-y-8 text-ink">
    <div>
      <Link href="/settings" className="text-primary underline focus-visible:outline-2 focus-visible:outline-ring"><T>Settings</T></Link>
      <h1 className="mt-3 text-3xl font-semibold"><T>Units and product categories</T></h1>
      <p className="mt-3 max-w-2xl leading-7 text-ink-muted"><T>Manage the weights and categories used for your products. Stock uses kilograms, accurate to one gram. Inactive entries stay in history and cannot be selected for new goods.</T></p>
      {!canManage && <p className="mt-3 text-ink-muted"><T>Only owners, admins, and managers can change these entries.</T></p>}
    </div>
    <section aria-labelledby="catalog-units" className="space-y-4">
      <h2 id="catalog-units" className="text-xl font-semibold"><T>Weight units</T></h2>
      <p className="max-w-2xl leading-7 text-ink-muted"><T>Pilot weights: 1 maan = 4.4 kg; 1 khorwar = 100 maan = 440 kg. Bags use their actual weight: 10 maan is 44 kg and 11 maan is 48.4 kg. Changes apply to future entries; past goods retain their recorded weights.</T></p>
      {canManage && <div className="space-y-5 rounded-xl border border-border bg-surface p-5">
        <CatalogForm entity="defaults" />
        <CatalogForm entity="unit" />
      </div>}
      {units.length === 0 && <p><T>No weight units yet.</T></p>}
      <ul className="space-y-4">{units.map((unit) => <li key={unit.id} className="space-y-3 rounded-xl border border-border bg-surface p-5">
        <h3 className="break-words font-semibold" dir="auto">{unit.name}</h3>
        <p>{unit.isActive ? <T>Active</T> : <T>Inactive</T>}</p>
        <p>{unit.kind === "bag" ? <T>Actual weight per bag</T> : <T><bdi dir="ltr">{unit.kilogramsPerUnit}</bdi> kg per unit</T>}</p>
        {canManage && unit.isActive && <CatalogForm key={`${unit.name}-${unit.kind}-${unit.kilogramsPerUnit}`} entity="unit" entry={unit} />}
      </li>)}</ul>
    </section>
    <section aria-labelledby="catalog-categories" className="space-y-4">
      <h2 id="catalog-categories" className="text-xl font-semibold"><T>Product categories</T></h2>
      {canManage && <div className="rounded-xl border border-border bg-surface p-5"><CatalogForm entity="category" /></div>}
      {categories.length === 0 && <p><T>No product categories yet.</T></p>}
      <ul className="space-y-4">{categories.map((category) => <li key={category.id} className="space-y-3 rounded-xl border border-border bg-surface p-5">
        <h3 className="break-words font-semibold" dir="auto">{category.name}</h3>
        <p>{category.isActive ? <T>Active</T> : <T>Inactive</T>}</p>
        {canManage && category.isActive && <CatalogForm key={category.name} entity="category" entry={category} />}
      </li>)}</ul>
    </section>
  </div>;
}
