"use client";

import { T } from "gt-next";
import { useActionState, useId, type ReactNode } from "react";
import { updateStaff } from "../actions";

export function StaffForm({ children }: { children: ReactNode }) {
  const [state, action, pending] = useActionState(updateStaff, { status: "idle" });
  const feedbackId = useId();
  return (
    <form action={action} aria-busy={pending} aria-describedby={feedbackId} className="space-y-3">
      <fieldset disabled={pending} className="flex min-w-0 flex-wrap items-end gap-3 disabled:opacity-60">{children}</fieldset>
      <div id={feedbackId} className="text-sm leading-6 [&_[role=alert]]:text-destructive [&_[role=status]]:text-success">
        {pending && <p role="status"><T>Saving…</T></p>}
        {state.status === "success" && <p role="status"><T>Saved.</T></p>}
        {state.status === "invalid" && <p role="alert"><T>Check the details. Use a valid email, account ID, or one of the listed business roles.</T></p>}
        {state.status === "conflict" && <p role="alert"><T>This membership or invitation has changed. Reload the list and try again.</T></p>}
        {state.status === "last-owner" && <p role="alert"><T>Keep at least one active owner. Assign another current member as owner first.</T></p>}
        {state.status === "owner-required" && <p role="alert"><T>Only an owner can grant, change, or remove ownership.</T></p>}
        {state.status === "error" && <p role="alert"><T>The change could not be confirmed. Reload the list before retrying. For email invitations, check that Clerk email invitations are enabled, or add an existing account manually. Reference: {state.correlationId}</T></p>}
      </div>
    </form>
  );
}
