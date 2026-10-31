import type { Metadata } from "next";
import Link from "next/link";
import { T } from "gt-next";
import { getCatalogWorkspace, getProduct } from "@/db/catalog";
import { ProductForm } from "../_components/product-form";
import { ArrowLeft } from "lucide-react";
import { PageHeader, Panel, StatusBadge } from "@/components/workspace";

export const metadata: Metadata = { title: "Product details" };

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [workspace, product] = await Promise.all([getCatalogWorkspace(), getProduct(id)]);
  return <div className="max-w-4xl space-y-7">
    <Link href="/products" className="inline-flex min-h-11 items-center gap-2 text-sm text-ink-muted hover:text-primary"><ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" /><T>Products</T></Link>
    <PageHeader title={<bdi className="break-words" dir="auto">{product.name}</bdi>} action={<StatusBadge active={product.isActive} />} />
    <Panel>
      <dl className="grid gap-6 break-words sm:grid-cols-3">
        <div><dt className="text-xs font-medium text-ink-muted"><T>Code / SKU</T></dt><dd className="mt-2 text-sm font-medium" dir="auto">{product.sku ?? <T>No code</T>}</dd></div>
        <div><dt className="text-xs font-medium text-ink-muted"><T>Weight unit</T></dt><dd className="mt-2 text-sm font-medium" dir="auto">{product.unitName}</dd></div>
        <div><dt className="text-xs font-medium text-ink-muted"><T>Category</T></dt><dd className="mt-2 text-sm font-medium" dir="auto">{product.categoryName ?? <T>No category</T>}</dd></div>
      </dl>
    </Panel>
    {!product.isActive && <p className="rounded-xl bg-muted p-4 text-sm leading-6 text-ink-muted"><T>This product is inactive. Its record is retained and cannot be edited.</T></p>}
    {workspace.canManage && product.isActive && <Panel aria-labelledby="edit-product" className="space-y-5">
      <div><h2 id="edit-product" className="text-lg font-semibold"><T>Edit product</T></h2>
      <p className="mt-1 text-sm leading-6 text-ink-muted"><T>Choose active weight units and categories when saving changes. Deactivation keeps the product record.</T></p></div>
      <ProductForm key={`${product.name}-${product.sku}-${product.unitId}-${product.categoryId}`} product={product} units={workspace.units} categories={workspace.categories} />
    </Panel>}
  </div>;
}
