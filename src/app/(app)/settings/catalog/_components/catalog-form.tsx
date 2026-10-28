"use client";

import { T } from "gt-next";
import { useActionState, useId, useState } from "react";
import { updateCatalog } from "../actions";

type CatalogFormProps = { entity: "unit" | "category"; entry?: {
  id: string; name: string; kind?: "fixed" | "bag"; kilogramsPerUnit?: string | null;
} } | { entity: "defaults" };

const inputClass = "mt-2 min-h-11 w-full rounded-lg border border-border bg-surface px-3 text-base text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const buttonClass = "min-h-11 rounded-lg border border-border px-4 font-semibold text-ink hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60";

export function CatalogForm(props: CatalogFormProps) {
  const entry = props.entity === "defaults" ? undefined : props.entry;
  const [name, setName] = useState(entry?.name ?? "");
  const [kind, setKind] = useState(entry?.kind ?? "fixed");
  const [weight, setWeight] = useState(entry?.kilogramsPerUnit ?? "");
  const [state, action, pending] = useActionState(updateCatalog, { status: "idle" });
  const id = useId();
  const invalid = state.status === "invalid" ? state.fields : [];
  return <form action={action} aria-busy={pending} aria-describedby={`${id}-feedback`} className="space-y-3">
    <fieldset disabled={pending} className="flex min-w-0 flex-wrap items-end gap-3 disabled:opacity-60">
      {props.entity === "defaults" ? <button className={buttonClass} name="operation" value="seed-units" type="submit"><T>Add pilot weight units</T></button> : <>
        {entry && <input type="hidden" name="id" value={entry.id} />}
        <div className="min-w-0 flex-1 basis-48">
          <label htmlFor={`${id}-name`}>{props.entity === "unit" ? <T>Unit name</T> : <T>Category name</T>}</label>
          <input id={`${id}-name`} name="name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={80}
            dir="auto" aria-invalid={invalid.includes("name")} aria-describedby={`${id}-feedback`} className={inputClass} />
        </div>
        {props.entity === "unit" && <>
          <div className="min-w-0 flex-1 basis-48"><label htmlFor={`${id}-kind`}><T>Weight basis</T></label>
            <select id={`${id}-kind`} name="kind" value={kind} onChange={(event) => setKind(event.target.value === "bag" ? "bag" : "fixed")}
              aria-invalid={invalid.includes("unit")} aria-describedby={`${id}-feedback`} className={inputClass}>
              <option value="fixed"><T>Fixed weight</T></option><option value="bag"><T>Actual bag weight</T></option>
            </select>
          </div>
          {kind === "fixed" ? <div className="min-w-0 flex-1 basis-48">
            <label htmlFor={`${id}-weight`}><T>Kilograms per unit</T></label>
            <input id={`${id}-weight`} name="kilogramsPerUnit" value={weight} onChange={(event) => setWeight(event.target.value)}
              type="text" inputMode="decimal" dir="ltr" required maxLength={22} pattern="[0-9]{1,18}(\.[0-9]{1,3})?"
              aria-invalid={invalid.includes("unit")} aria-describedby={`${id}-feedback`} className={inputClass} />
          </div> : <p className="max-w-sm text-sm text-ink-muted"><T>Enter each bag’s actual weight when recording goods.</T></p>}
        </>}
        <button className={buttonClass} type="submit" name="operation" value={`${entry ? "update" : "create"}-${props.entity}`}>
          {entry ? <T>Save changes</T> : <T>Add</T>}
        </button>
        {entry && <button className={buttonClass} type="submit" formNoValidate name="operation" value={`deactivate-${props.entity}`}><T>Deactivate</T></button>}
      </>}
    </fieldset>
    <div id={`${id}-feedback`}>
      {pending && <p role="status"><T>Saving…</T></p>}
      {state.status === "success" && <p role="status"><T>Saved.</T></p>}
      {state.status === "invalid" && <p role="alert"><T>Use a name of 1–80 characters and a positive weight with at most three decimal places. Use a dot as the decimal separator.</T></p>}
      {state.status === "duplicate" && <p role="alert"><T>This name is already used in this business, including inactive entries. Choose another name.</T></p>}
      {state.status === "conflict" && <p role="alert"><T>This entry is unavailable or inactive. Reload the list before trying again.</T></p>}
      {state.status === "error" && <p role="alert"><T>The change could not be confirmed. Reload the list before retrying. Reference: {state.correlationId}</T></p>}
    </div>
  </form>;
}
