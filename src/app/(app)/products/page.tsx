import type { Metadata } from "next";
import Link from "next/link";
import { T } from "gt-next";
import { Package, Plus, SlidersHorizontal, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel, StatusBadge } from "@/components/workspace";
import { getCatalogWorkspace, getProducts } from "@/db/catalog";
import { ProductForm } from "./_components/product-form";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage() {
  const [workspace, products] = await Promise.all([getCatalogWorkspace(), getProducts()]);
  return <div className="space-y-8">
    <PageHeader title={<T>Products</T>} description={<T>A clear catalogue of the goods your business trades.</T>}
      action={<>
        <Button asChild variant="outline"><Link href="/settings/catalog"><SlidersHorizontal aria-hidden="true" /><T>Units & categories</T></Link></Button>
        {workspace.canManage && <Button asChild><a href="#add-product"><Plus aria-hidden="true" /><T>Add product</T></a></Button>}
      </>} />
    {!workspace.canManage && <p className="rounded-xl bg-muted/60 px-4 py-3 text-sm text-ink-muted"><T>Only owners, admins, and managers can change products.</T></p>}
    <Panel aria-labelledby="product-list" className="overflow-hidden p-0 sm:p-0">
      <div className="flex items-center gap-3 border-b border-border/70 px-5 py-5 sm:px-6">
        <h2 id="product-list" className="font-semibold"><T>Product catalogue</T></h2><span className="rounded-md bg-muted px-2 py-0.5 text-xs tabular-nums text-ink-muted">{products.length}</span>
      </div>
      {products.length === 0 ? <div className="flex flex-col items-center px-6 py-14 text-center">
        <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-page text-ink-muted"><Package className="size-6" aria-hidden="true" /></span>
        <p className="font-semibold"><T>No products yet.</T></p>
        <p className="mt-2 max-w-sm text-sm leading-6 text-ink-muted"><T>Your products will appear here. Start with a name and a weight unit.</T></p>
      </div> : <>
        <div aria-hidden="true" className="hidden grid-cols-[minmax(0,1fr)_6rem_9rem_6rem] gap-5 bg-page/60 px-6 py-3 text-xs font-medium text-ink-muted md:grid">
          <span><T>Product</T></span><span><T>Weight unit</T></span><span><T>Category</T></span><span><T>Status</T></span>
        </div>
        <ul className="divide-y divide-border/60">{products.map((product) => <li key={product.id} className="grid min-w-0 gap-3 px-5 py-5 transition-colors hover:bg-page/60 sm:px-6 md:grid-cols-[minmax(0,1fr)_6rem_9rem_6rem] md:items-center md:gap-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border/60 bg-page"><Package className="size-[18px] text-ink-muted" aria-hidden="true" /></span>
            <div className="min-w-0"><Link href={`/products/${product.id}`} className="inline-flex min-h-11 max-w-full items-center gap-2 break-words text-sm font-semibold hover:text-primary hover:underline"><bdi dir="auto" className="min-w-0">{product.name}</bdi><ArrowUpRight className="size-3.5 shrink-0 text-ink-muted rtl:-scale-x-100" aria-hidden="true" /></Link>
              {product.sku && <p className="mt-1 break-words font-mono text-xs text-ink-muted" dir="auto">{product.sku}</p>}
            </div>
          </div>
          <p className="break-words text-sm text-ink-muted"><span className="me-2 md:sr-only"><T>Weight unit:</T></span><bdi dir="auto">{product.unitName}</bdi></p>
          <p className="break-words text-sm text-ink-muted"><span className="me-2 md:sr-only"><T>Category:</T></span><bdi dir="auto">{product.categoryName ?? <T>No category</T>}</bdi></p>
          <StatusBadge active={product.isActive} />
        </li>)}</ul>
      </>}
    </Panel>
    {workspace.canManage && <Panel aria-labelledby="add-product" className="space-y-5">
      <div><h2 id="add-product" tabIndex={-1} className="text-lg font-semibold"><T>Add product</T></h2>
        <p className="mt-1 text-sm leading-6 text-ink-muted"><T>Choose the weight unit used when entering goods. Stock is measured in kilograms.</T></p></div>
      {workspace.units.some((unit) => unit.isActive) ? <ProductForm units={workspace.units} categories={workspace.categories} />
        : <p className="rounded-xl bg-page p-4 text-sm leading-6"><T>Add an active weight unit before creating a product.</T> <Link href="/settings/catalog" className="font-medium text-primary underline"><T>Manage weight units and categories</T></Link></p>}
    </Panel>}
  </div>;
}
