"use client";

import { T } from "gt-next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldLabel } from "@/components/ui/field";
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

  if (state.status === "success") return <OrganizationActivation organizationId={state.clerkOrganizationId} />;

  return (
    <form action={action} className="space-y-5" aria-busy={pending}>
      {resuming && <p className="rounded-lg bg-muted p-4 text-sm leading-6 text-ink"><T>Setup has already started. Continue with your saved business details.</T></p>}
      <div>
        <FieldLabel htmlFor="name" className="mb-2.5 block text-sm font-medium"><T>Business name</T></FieldLabel>
        <Input
          id="name"
          name="name"
          required
          maxLength={100}
          autoComplete="organization"
          dir="auto"
          readOnly={resuming}
          disabled={pending}
          value={values.name}
          onChange={(event) => setValues({ ...values, name: event.target.value })}
          aria-invalid={fields.includes("name")}
          aria-describedby={fields.includes("name") ? "name-error" : undefined}
        />
        {fields.includes("name") && <p id="name-error" className="mt-2 text-sm"><T>Enter a business name of 1 to 100 characters.</T></p>}
      </div>
      <div>
        <FieldLabel htmlFor="businessType" className="mb-2.5 block"><T>Business type</T></FieldLabel>
        <Input
          id="businessType"
          name="businessType"
          required
          maxLength={100}
          dir="auto"
          readOnly={resuming}
          disabled={pending}
          value={values.businessType}
          onChange={(event) => setValues({ ...values, businessType: event.target.value })}
          aria-invalid={fields.includes("businessType")}
          aria-describedby={fields.includes("businessType") ? "businessType-error" : "businessType-hint"}
        />
        <p id="businessType-hint" className="mt-2 text-sm text-ink-muted"><T>For example, grain and mixed-goods wholesaler.</T></p>
        {fields.includes("businessType") && <p id="businessType-error" className="mt-2 text-sm"><T>Enter a business type of 1 to 100 characters.</T></p>}
      </div>
      <div>
        <FieldLabel htmlFor="timezone" className="mb-2.5 block"><T>Business timezone</T></FieldLabel>
        <Input
          id="timezone"
          name="timezone"
          list="timezones"
          required
          maxLength={100}
          dir="ltr"
          autoCapitalize="none"
          spellCheck={false}
          readOnly={resuming}
          disabled={pending}
          value={values.timezone}
          onChange={(event) => setValues({ ...values, timezone: event.target.value })}
          aria-invalid={fields.includes("timezone")}
          aria-describedby={fields.includes("timezone") ? "timezone-error" : "timezone-hint"}
        />
        <datalist id="timezones"><option value="Asia/Kabul" /></datalist>
        <p id="timezone-hint" className="mt-2 text-sm text-ink-muted"><T>Afghanistan time: Asia/Kabul (UTC+04:30).</T></p>
        {fields.includes("timezone") && <p id="timezone-error" className="mt-2 text-sm"><T>Enter a valid timezone, such as Asia/Kabul.</T></p>}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="baseCurrency" className="mb-2.5 block"><T>Base currency</T></FieldLabel>
          <Input
            id="baseCurrency"
            name="baseCurrency"
            value="AFN"
            readOnly
            disabled={pending}
            dir="ltr"
            aria-invalid={fields.includes("baseCurrency")}
            aria-describedby="currency-hint"
          />
          <p id="currency-hint" className="mt-2 text-sm text-ink-muted"><T>Afghan afghani</T></p>
        </div>
        <div>
          <FieldLabel htmlFor="locale" className="mb-2.5 block"><T>Business language</T></FieldLabel>
          {resuming && <input type="hidden" name="locale" value={values.locale} />}
          <Select name={resuming ? undefined : "locale"} disabled={resuming || pending} value={values.locale} onValueChange={(locale) => setValues({ ...values, locale })}>
            <SelectTrigger id="locale" aria-invalid={fields.includes("locale")} aria-describedby={fields.includes("locale") ? "locale-error" : undefined}><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="en-US">English</SelectItem><SelectItem value="ps-AF" lang="ps">پښتو</SelectItem></SelectContent>
          </Select>
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
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? <T>Setting up business…</T> : resuming ? <T>Continue setup</T> : <T>Create business</T>}
      </Button>
    </form>
  );
}
