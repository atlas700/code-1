import type { Metadata } from "next";
import Link from "next/link";
import { T } from "gt-next";
import { getCatalogWorkspace, getProduct } from "@/db/catalog";
import { ProductForm } from "../_components/product-form";

export const metadata: Metadata = { title: "Product details" };

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [workspace, product] = await Promise.all([getCatalogWorkspace(), getProduct(id)]);
  return <div className="space-y-6 text-ink">
    <Link href="/products" className="text-primary underline focus-visible:outline-2 focus-visible:outline-ring"><T>Products</T></Link>
    <h1 className="break-words text-3xl font-semibold" dir="auto">{product.name}</h1>
    <p>{product.isActive ? <T>Active</T> : <T>Inactive</T>}</p>
    <dl className="space-y-3 break-words">
      <div><dt className="font-semibold"><T>Code / SKU</T></dt><dd dir="auto">{product.sku ?? <T>No code</T>}</dd></div>
      <div><dt className="font-semibold"><T>Weight unit</T></dt><dd dir="auto">{product.unitName}</dd></div>
      <div><dt className="font-semibold"><T>Category</T></dt><dd dir="auto">{product.categoryName ?? <T>No category</T>}</dd></div>
    </dl>
    {!product.isActive && <p><T>This product is inactive. Its record is retained and cannot be edited.</T></p>}
    {workspace.canManage && product.isActive && <section aria-labelledby="edit-product" className="space-y-4 rounded-xl border border-border bg-surface p-5">
      <h2 id="edit-product" className="text-xl font-semibold"><T>Edit product</T></h2>
      <p className="text-ink-muted"><T>Choose active weight units and categories when saving changes. Deactivation keeps the product record.</T></p>
      <ProductForm key={`${product.name}-${product.sku}-${product.unitId}-${product.categoryId}`} product={product} units={workspace.units} categories={workspace.categories} />
    </section>}
  </div>;
}
