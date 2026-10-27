import type { Metadata } from "next";
import Link from "next/link";
import { T } from "gt-next";
import { requirePermission } from "@/db/authorization";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  await requirePermission("organization.read");
  return (
    <div className="space-y-5 text-ink">
      <h1 className="text-3xl font-semibold"><T>Settings</T></h1>
      <p className="text-ink-muted"><T>Owners and admins can manage staff membership and business roles.</T></p>
      <Link href="/settings/staff" prefetch={false} className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 font-semibold hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"><T>Manage staff</T></Link>
      <Link href="/join" prefetch={false} className="block text-primary underline focus-visible:outline-2 focus-visible:outline-ring"><T>Staff access and business selection</T></Link>
    </div>
  );
}
