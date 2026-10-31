"use client";

import { T } from "gt-next";
import { useActionState, useId, useState } from "react";
import { updateCatalog } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

type CatalogFormProps = { entity: "unit" | "category"; entry?: {
  id: string; name: string; kind?: "fixed" | "bag"; kilogramsPerUnit?: string | null;
} } | { entity: "defaults" };


export function CatalogForm(props: CatalogFormProps) {
  const entry = props.entity === "defaults" ? undefined : props.entry;
  const [name, setName] = useState(entry?.name ?? "");
  const [kind, setKind] = useState(entry?.kind ?? "fixed");
  const [weight, setWeight] = useState(entry?.kilogramsPerUnit ?? "");
  const [state, action, pending] = useActionState(updateCatalog, { status: "idle" });
  const id = useId();
  const invalid = state.status === "invalid" ? state.fields : [];
  return <form action={action} aria-busy={pending} aria-describedby={`${id}-feedback`} className="space-y-3">
    <fieldset disabled={pending} className="flex min-w-0 flex-wrap items-end gap-4 disabled:opacity-60">
      {props.entity === "defaults" ? <Button variant="outline" name="operation" value="seed-units" type="submit"><T>Add pilot weight units</T></Button> : <>
        {entry && <input type="hidden" name="id" value={entry.id} />}
        <Field className="flex-1 basis-48" data-invalid={invalid.includes("name")}>
          <FieldLabel htmlFor={`${id}-name`}>{props.entity === "unit" ? <T>Unit name</T> : <T>Category name</T>}</FieldLabel>
          <Input id={`${id}-name`} name="name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={80}
            dir="auto" aria-invalid={invalid.includes("name")} aria-describedby={invalid.includes("name") ? `${id}-name-error` : undefined} />
          {invalid.includes("name") && <FieldError id={`${id}-name-error`}><T>Enter a name of 1–80 characters.</T></FieldError>}
        </Field>
        {props.entity === "unit" && <>
          <Field className="flex-1 basis-48"><FieldLabel htmlFor={`${id}-kind`}><T>Weight basis</T></FieldLabel>
            <NativeSelect id={`${id}-kind`} name="kind" value={kind} onChange={(event) => setKind(event.target.value === "bag" ? "bag" : "fixed")}
              aria-invalid={invalid.includes("unit")} aria-describedby={`${id}-feedback`}>
              <option value="fixed"><T>Fixed weight</T></option><option value="bag"><T>Actual bag weight</T></option>
            </NativeSelect>
          </Field>
          {kind === "fixed" ? <Field className="flex-1 basis-48" data-invalid={invalid.includes("unit")}>
            <FieldLabel htmlFor={`${id}-weight`}><T>Kilograms per unit</T></FieldLabel>
            <Input id={`${id}-weight`} name="kilogramsPerUnit" value={weight} onChange={(event) => setWeight(event.target.value)}
              type="text" inputMode="decimal" dir="ltr" required maxLength={22} pattern="[0-9]{1,18}(\.[0-9]{1,3})?"
              aria-invalid={invalid.includes("unit")} aria-describedby={`${id}-feedback`} />
          </Field> : <p className="max-w-sm text-sm text-ink-muted"><T>Enter each bag’s actual weight when recording goods.</T></p>}
        </>}
        <Button type="submit" name="operation" value={`${entry ? "update" : "create"}-${props.entity}`}>
          {entry ? <T>Save changes</T> : <T>Add</T>}
        </Button>
        {entry && <Button variant="destructive" type="submit" formNoValidate name="operation" value={`deactivate-${props.entity}`}><T>Deactivate</T></Button>}
      </>}
    </fieldset>
    <div id={`${id}-feedback`} className="text-sm leading-6 [&_[role=alert]]:text-destructive [&_[role=status]]:text-success">
      {pending && <p role="status"><T>Saving…</T></p>}
      {state.status === "success" && <p role="status"><T>Saved.</T></p>}
      {state.status === "invalid" && <p role="alert"><T>Use a name of 1–80 characters and a positive weight with at most three decimal places. Use a dot as the decimal separator.</T></p>}
      {state.status === "duplicate" && <p role="alert"><T>This name is already used in this business, including inactive entries. Choose another name.</T></p>}
      {state.status === "conflict" && <p role="alert"><T>This entry is unavailable or inactive. Reload the list before trying again.</T></p>}
      {state.status === "error" && <p role="alert"><T>The change could not be confirmed. Reload the list before retrying. Reference: {state.correlationId}</T></p>}
    </div>
  </form>;
}
