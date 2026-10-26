"use client";

import { T } from "gt-next";
import type { ReactNode } from "react";
import { useActionState, useEffect, useRef, useState } from "react";
import { OrganizationActivation } from "@/auth/organization-activation";
import type { OrganizationDetails } from "@/db/onboarding";
import { createFirstOrganization } from "../actions";
import type { OnboardingState } from "../_lib/state";

type OnboardingFormProps = { initialValues: OrganizationDetails; resuming: boolean };

export function OnboardingForm({ initialValues, resuming }: OnboardingFormProps) {
  const [values, setValues] = useState(initialValues);
  const [state, action, pending] = useActionState<OnboardingState, FormData>(createFirstOrganization, { status: "idle" });
  const errorSummary = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.status === "invalid") errorSummary.current?.focus();
  }, [state]);
  const fields = state.status === "invalid" ? state.fields : [];
  const fieldLabels: Record<string, ReactNode> = {
    name: <T>Business name</T>,
    businessType: <T>Business type</T>,
    timezone: <T>Business timezone</T>,
    baseCurrency: <T>Base currency</T>,
    locale: <T>Business language</T>,
  };
  const inputClass = "mt-2 min-h-11 w-full rounded-lg border border-border bg-surface px-3 text-base text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring read-only:bg-page disabled:bg-page";

  if (state.status === "success") return <OrganizationActivation organizationId={state.clerkOrganizationId} />;

  return (
    <form action={action} className="space-y-5" aria-busy={pending}>
      {resuming && <p className="rounded-lg bg-muted p-4 text-sm leading-6 text-ink"><T>Setup has already started. Continue with your saved business details.</T></p>}
      <div>
        <label htmlFor="name" className="text-sm font-semibold"><T>Business name</T></label>
        <input
          id="name"
          name="name"
          required
          maxLength={100}
          autoComplete="organization"
          dir="auto"
          readOnly={resuming}
          value={values.name}
          onChange={(event) => setValues({ ...values, name: event.target.value })}
          aria-invalid={fields.includes("name")}
          aria-describedby={fields.includes("name") ? "name-error" : undefined}
          className={inputClass}
        />
        {fields.includes("name") && <p id="name-error" className="mt-2 text-sm"><T>Enter a business name of 1 to 100 characters.</T></p>}
      </div>
      <div>
        <label htmlFor="businessType" className="text-sm font-semibold"><T>Business type</T></label>
        <input
          id="businessType"
          name="businessType"
          required
          maxLength={100}
          dir="auto"
          readOnly={resuming}
          value={values.businessType}
          onChange={(event) => setValues({ ...values, businessType: event.target.value })}
          aria-invalid={fields.includes("businessType")}
          aria-describedby={fields.includes("businessType") ? "businessType-error" : "businessType-hint"}
          className={inputClass}
        />
        <p id="businessType-hint" className="mt-2 text-sm text-ink-muted"><T>For example, fruit and nut wholesaler.</T></p>
        {fields.includes("businessType") && <p id="businessType-error" className="mt-2 text-sm"><T>Enter a business type of 1 to 100 characters.</T></p>}
      </div>
      <div>
        <label htmlFor="timezone" className="text-sm font-semibold"><T>Business timezone</T></label>
        <input
          id="timezone"
          name="timezone"
          list="timezones"
          required
          maxLength={100}
          dir="ltr"
          autoCapitalize="none"
          spellCheck={false}
          readOnly={resuming}
          value={values.timezone}
          onChange={(event) => setValues({ ...values, timezone: event.target.value })}
          aria-invalid={fields.includes("timezone")}
          aria-describedby={fields.includes("timezone") ? "timezone-error" : "timezone-hint"}
          className={inputClass}
        />
        <datalist id="timezones"><option value="Asia/Kabul" /></datalist>
        <p id="timezone-hint" className="mt-2 text-sm text-ink-muted"><T>For Afghanistan, use Asia/Kabul.</T></p>
        {fields.includes("timezone") && <p id="timezone-error" className="mt-2 text-sm"><T>Enter a valid timezone, such as Asia/Kabul.</T></p>}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="baseCurrency" className="text-sm font-semibold"><T>Base currency</T></label>
          <input
            id="baseCurrency"
            name="baseCurrency"
            value="AFN"
            readOnly
            dir="ltr"
            aria-invalid={fields.includes("baseCurrency")}
            aria-describedby="currency-hint"
            className={inputClass}
          />
          <p id="currency-hint" className="mt-2 text-sm text-ink-muted"><T>Afghan afghani</T></p>
        </div>
        <div>
          <label htmlFor="locale" className="text-sm font-semibold"><T>Business language</T></label>
          {resuming && <input type="hidden" name="locale" value={values.locale} />}
          <select
            id="locale"
            name={resuming ? undefined : "locale"}
            disabled={resuming}
            value={values.locale}
            onChange={(event) => setValues({ ...values, locale: event.target.value })}
            aria-invalid={fields.includes("locale")}
            aria-describedby={fields.includes("locale") ? "locale-error" : undefined}
            className={inputClass}
          >
            <option value="en-US">English</option>
            <option value="ps-AF" lang="ps">پښتو</option>
          </select>
          {fields.includes("locale") && <p id="locale-error" className="mt-2 text-sm"><T>Select a supported business language.</T></p>}
        </div>
      </div>
      <div>
        {state.status === "invalid" && (
          <div
            ref={errorSummary}
            tabIndex={-1}
            role="alert"
            className="rounded-lg border border-border p-4 text-sm leading-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <p><T>Check the business details and correct the marked fields. Currency must be AFN.</T></p>
            <ul className="mt-2 list-inside list-disc">
              {fields.filter((field) => field in fieldLabels).map((field) => (
                <li key={field}><a href={`#${field}`} className="text-primary underline focus-visible:outline-2 focus-visible:outline-ring">{fieldLabels[field]}</a></li>
              ))}
            </ul>
          </div>
        )}
        {state.status === "conflict" && <p role="alert" className="rounded-lg border border-border p-4 text-sm leading-6"><T>Setup already has saved details. Reload this page to continue with them.</T></p>}
        {state.status === "denied" && <p role="alert" className="rounded-lg border border-border p-4 text-sm leading-6"><T>We could not verify that you created this business and still belong to it. Contact the business owner for help.</T></p>}
        {state.status === "error" && <p role="alert" className="rounded-lg border border-border p-4 text-sm leading-6"><T>Setup could not finish. Please retry with the same details. Reference: {state.correlationId}</T></p>}
      </div>
      <button type="submit" disabled={pending} className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-5 font-semibold text-on-primary transition-colors hover:bg-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-wait disabled:opacity-60">
        {pending ? <T>Setting up business…</T> : resuming ? <T>Continue setup</T> : <T>Create business</T>}
      </button>
    </form>
  );
}
