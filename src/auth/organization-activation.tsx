"use client";

import { useClerk } from "@clerk/nextjs";
import { T } from "gt-next";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";

export function OrganizationActivation({ organizationId }: { organizationId: string }) {
  const { setActive } = useClerk();
  const [failed, activate, pending] = useActionState(async () => {
    try {
      await setActive({
        organization: organizationId,
        navigate: async ({ decorateUrl }) => { window.location.assign(decorateUrl("/dashboard")); },
      });
      return false;
    } catch {
      return true;
    }
  }, false);

  return (
    <div className="space-y-5">
      <p role="status" className="leading-7 text-ink-muted"><T>Open your workspace to continue.</T></p>
      {failed && <p role="alert" className="leading-7 text-ink"><T>The workspace could not open. Please try again.</T></p>}
      <form action={activate}>
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? <T>Opening workspace…</T> : <T>Open workspace</T>}
        </Button>
      </form>
    </div>
  );
}
