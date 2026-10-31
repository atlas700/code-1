import type { Metadata } from "next";
import Link from "next/link";
import { T, Var } from "gt-next";
import { getCatalogWorkspace, getProducts } from "@/db/catalog";
import { ProductForm } from "./_components/product-form";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage() {
  const [workspace, products] = await Promise.all([getCatalogWorkspace(), getProducts()]);
  return <div className="space-y-8 text-ink">
    <div className="space-y-3">
      <h1 className="text-3xl font-semibold"><T>Products</T></h1>
      <p className="max-w-2xl leading-7 text-ink-muted"><T>Add the products your business trades. Choose the weight unit used when entering goods; stock is measured in kilograms.</T></p>
      <Link href="/settings/catalog" className="text-primary underline focus-visible:outline-2 focus-visible:outline-ring"><T>Manage weight units and categories</T></Link>
      {!workspace.canManage && <p className="text-ink-muted"><T>Only owners, admins, and managers can change products.</T></p>}
    </div>
    {workspace.canManage && <section aria-labelledby="add-product" className="space-y-4 rounded-xl border border-border bg-surface p-5">
      <h2 id="add-product" className="text-xl font-semibold"><T>Add product</T></h2>
      {workspace.units.some((unit) => unit.isActive) ? <ProductForm units={workspace.units} categories={workspace.categories} />
        : <p><T>Add an active weight unit before creating a product.</T></p>}
    </section>}
    <section aria-labelledby="product-list" className="space-y-4">
      <h2 id="product-list" className="text-xl font-semibold"><T>Product catalogue</T></h2>
      {products.length === 0 && <p><T>No products yet.</T></p>}
      <ul className="space-y-4">{products.map((product) => <li key={product.id} className="space-y-2 rounded-xl border border-border bg-surface p-5">
        <Link href={`/products/${product.id}`} className="break-words font-semibold text-primary underline focus-visible:outline-2 focus-visible:outline-ring"><bdi dir="auto">{product.name}</bdi></Link>
        <p>{product.isActive ? <T>Active</T> : <T>Inactive</T>}</p>
        {product.sku && <p className="break-words"><T>Code: <bdi dir="auto"><Var>{product.sku}</Var></bdi></T></p>}
        <p className="break-words"><T>Weight unit: <bdi dir="auto"><Var>{product.unitName}</Var></bdi></T></p>
        {product.categoryName && <p className="break-words"><T>Category: <bdi dir="auto"><Var>{product.categoryName}</Var></bdi></T></p>}
      </li>)}</ul>
    </section>
  </div>;
}
