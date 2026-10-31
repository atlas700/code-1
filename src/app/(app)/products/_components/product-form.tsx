"use client";

import { T, Var } from "gt-next";
import { useActionState, useId, useState } from "react";
import type { getCatalogWorkspace, getProduct } from "@/db/catalog";
import { updateProduct } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Plus, Check } from "lucide-react";

type ProductFormProps = Pick<Awaited<ReturnType<typeof getCatalogWorkspace>>, "units" | "categories"> & {
  product?: Awaited<ReturnType<typeof getProduct>>;
};

export function ProductForm({ product, units, categories }: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [unitId, setUnitId] = useState(product?.unitId ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [state, action, pending] = useActionState(updateProduct, { status: "idle" });
  const id = useId();
  const invalid = state.status === "invalid" ? state.fields : [];
  return <form action={action} aria-busy={pending} aria-describedby={`${id}-feedback`} className="space-y-5">
    <fieldset disabled={pending} className="grid min-w-0 gap-5 sm:grid-cols-2 disabled:opacity-60">
      {product && <input type="hidden" name="id" value={product.id} />}
      <Field data-invalid={invalid.includes("name")}>
        <FieldLabel htmlFor={`${id}-name`}><T>Product name</T></FieldLabel>
        <Input id={`${id}-name`} name="name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={80}
          dir="auto" aria-invalid={invalid.includes("name")} aria-describedby={invalid.includes("name") ? `${id}-name-error` : undefined} />
        {invalid.includes("name") && <FieldError id={`${id}-name-error`}><T>Enter a product name of 1–80 characters.</T></FieldError>}
      </Field>
      <Field data-invalid={invalid.includes("sku")}>
        <FieldLabel htmlFor={`${id}-sku`}><T>Code / SKU (optional)</T></FieldLabel>
        <Input id={`${id}-sku`} name="sku" value={sku} onChange={(event) => setSku(event.target.value)} maxLength={40}
          dir="auto" aria-invalid={invalid.includes("sku")} aria-describedby={invalid.includes("sku") ? `${id}-sku-error` : undefined} />
        {invalid.includes("sku") && <FieldError id={`${id}-sku-error`}><T>Use a code of at most 40 characters.</T></FieldError>}
      </Field>
      <Field data-invalid={invalid.includes("unitId")}>
        <FieldLabel htmlFor={`${id}-unit`}><T>Weight unit</T></FieldLabel>
        <NativeSelect id={`${id}-unit`} name="unitId" value={unitId} onChange={(event) => setUnitId(event.target.value)} required
          aria-invalid={invalid.includes("unitId")} aria-describedby={invalid.includes("unitId") ? `${id}-unit-error` : undefined}>
          <option value="" disabled><T>Choose a weight unit</T></option>
          {units.filter((unit) => unit.isActive || unit.id === product?.unitId).map((unit) =>
            <option key={unit.id} value={unit.id} disabled={!unit.isActive}>{unit.name}{!unit.isActive && <T> (inactive)</T>}</option>)}
        </NativeSelect>
        {invalid.includes("unitId") && <FieldError id={`${id}-unit-error`}><T>Choose an active weight unit.</T></FieldError>}
      </Field>
      <Field data-invalid={invalid.includes("categoryId")}>
        <FieldLabel htmlFor={`${id}-category`}><T>Category (optional)</T></FieldLabel>
        <NativeSelect id={`${id}-category`} name="categoryId" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}
          aria-invalid={invalid.includes("categoryId")} aria-describedby={invalid.includes("categoryId") ? `${id}-category-error` : undefined}>
          <option value=""><T>No category</T></option>
          {categories.filter((category) => category.isActive || category.id === product?.categoryId).map((category) =>
            <option key={category.id} value={category.id} disabled={!category.isActive}>{category.name}{!category.isActive && <T> (inactive)</T>}</option>)}
        </NativeSelect>
        {invalid.includes("categoryId") && <FieldError id={`${id}-category-error`}><T>Choose an active category or no category.</T></FieldError>}
      </Field>
      <div className="flex flex-wrap gap-3 border-t border-border/70 pt-5 sm:col-span-2">
        <Button type="submit" name="operation" value={product ? "update-product" : "create-product"}>
          {product ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
          {product ? <T>Save changes</T> : <T>Add product</T>}
        </Button>
        {product && <Button variant="destructive" type="submit" formNoValidate name="operation" value="deactivate-product"><T>Deactivate product</T></Button>}
      </div>
    </fieldset>
    <div id={`${id}-feedback`} className="text-sm leading-6 [&_[role=alert]]:text-destructive [&_[role=status]]:text-success">
      {pending && <p role="status"><T>Saving…</T></p>}
      {state.status === "success" && <p role="status"><T>Saved.</T></p>}
      {state.status === "invalid" && <p role="alert"><T>Enter a name of 1–80 characters, an optional code of at most 40 characters, and an active weight unit. Choose an active category or no category.</T></p>}
      {state.status === "duplicate" && <p role="alert"><T>This product name or code is already used in this business, including inactive products. Choose another name or code.</T></p>}
      {state.status === "conflict" && <p role="alert"><T>This product is unavailable or inactive. Reload the list before trying again.</T></p>}
      {state.status === "error" && <p role="alert"><T>The change could not be confirmed. Reload the list before retrying. Reference: <Var>{state.correlationId}</Var></T></p>}
    </div>
  </form>;
}
