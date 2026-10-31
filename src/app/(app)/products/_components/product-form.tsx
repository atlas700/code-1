"use client";

import { T, Var } from "gt-next";
import { useActionState, useId, useState } from "react";
import type { getCatalogWorkspace, getProduct } from "@/db/catalog";
import { updateProduct } from "../actions";

type ProductFormProps = Pick<Awaited<ReturnType<typeof getCatalogWorkspace>>, "units" | "categories"> & {
  product?: Awaited<ReturnType<typeof getProduct>>;
};
const inputClass = "mt-2 min-h-11 w-full rounded-lg border border-border bg-surface px-3 text-base text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const buttonClass = "min-h-11 rounded-lg border border-border px-4 font-semibold text-ink hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60";

export function ProductForm({ product, units, categories }: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [unitId, setUnitId] = useState(product?.unitId ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [state, action, pending] = useActionState(updateProduct, { status: "idle" });
  const id = useId();
  const invalid = state.status === "invalid" ? state.fields : [];
  return <form action={action} aria-busy={pending} aria-describedby={`${id}-feedback`} className="space-y-4">
    <fieldset disabled={pending} className="grid min-w-0 gap-4 sm:grid-cols-2 disabled:opacity-60">
      {product && <input type="hidden" name="id" value={product.id} />}
      <div className="min-w-0">
        <label htmlFor={`${id}-name`}><T>Product name</T></label>
        <input id={`${id}-name`} name="name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={80}
          dir="auto" aria-invalid={invalid.includes("name")} aria-describedby={`${id}-feedback`} className={inputClass} />
      </div>
      <div className="min-w-0">
        <label htmlFor={`${id}-sku`}><T>Code / SKU (optional)</T></label>
        <input id={`${id}-sku`} name="sku" value={sku} onChange={(event) => setSku(event.target.value)} maxLength={40}
          dir="auto" aria-invalid={invalid.includes("sku")} aria-describedby={`${id}-feedback`} className={inputClass} />
      </div>
      <div className="min-w-0">
        <label htmlFor={`${id}-unit`}><T>Weight unit</T></label>
        <select id={`${id}-unit`} name="unitId" value={unitId} onChange={(event) => setUnitId(event.target.value)} required
          aria-invalid={invalid.includes("unitId")} aria-describedby={`${id}-feedback`} className={inputClass}>
          <option value="" disabled><T>Choose a weight unit</T></option>
          {units.filter((unit) => unit.isActive || unit.id === product?.unitId).map((unit) =>
            <option key={unit.id} value={unit.id} disabled={!unit.isActive}>{unit.name}{!unit.isActive && <T> (inactive)</T>}</option>)}
        </select>
      </div>
      <div className="min-w-0">
        <label htmlFor={`${id}-category`}><T>Category (optional)</T></label>
        <select id={`${id}-category`} name="categoryId" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}
          aria-invalid={invalid.includes("categoryId")} aria-describedby={`${id}-feedback`} className={inputClass}>
          <option value=""><T>No category</T></option>
          {categories.filter((category) => category.isActive || category.id === product?.categoryId).map((category) =>
            <option key={category.id} value={category.id} disabled={!category.isActive}>{category.name}{!category.isActive && <T> (inactive)</T>}</option>)}
        </select>
      </div>
      <div className="flex flex-wrap gap-3 sm:col-span-2">
        <button className={buttonClass} type="submit" name="operation" value={product ? "update-product" : "create-product"}>
          {product ? <T>Save changes</T> : <T>Add product</T>}
        </button>
        {product && <button className={buttonClass} type="submit" formNoValidate name="operation" value="deactivate-product"><T>Deactivate product</T></button>}
      </div>
    </fieldset>
    <div id={`${id}-feedback`}>
      {pending && <p role="status"><T>Saving…</T></p>}
      {state.status === "success" && <p role="status"><T>Saved.</T></p>}
      {state.status === "invalid" && <p role="alert"><T>Enter a name of 1–80 characters, an optional code of at most 40 characters, and an active weight unit. Choose an active category or no category.</T></p>}
      {state.status === "duplicate" && <p role="alert"><T>This product name or code is already used in this business, including inactive products. Choose another name or code.</T></p>}
      {state.status === "conflict" && <p role="alert"><T>This product is unavailable or inactive. Reload the list before trying again.</T></p>}
      {state.status === "error" && <p role="alert"><T>The change could not be confirmed. Reload the list before retrying. Reference: <Var>{state.correlationId}</Var></T></p>}
    </div>
  </form>;
}
