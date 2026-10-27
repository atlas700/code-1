import type { Metadata } from "next";
import { unstable_rethrow } from "next/navigation";
import { T } from "gt-next";
import { SignOut } from "@/auth/components";
import { OrganizationActivation } from "@/auth/organization-activation";
import { requireSession } from "@/auth/server";
import { getStaffAccessOrganizations } from "@/auth/staff";

export const metadata: Metadata = { title: "Staff access" };

export default async function StaffAccessPage() {
  const { userId } = await requireSession();
  let memberships;
  try {
    memberships = await getStaffAccessOrganizations(userId);
  } catch (error) {
    unstable_rethrow(error);
    throw new Error("Staff access unavailable.");
  }
  return (
    <main className="mx-auto min-h-screen max-w-2xl space-y-6 px-4 py-12 text-ink">
      <h1 className="text-3xl font-semibold"><T>Staff access</T></h1>
      <p className="leading-7"><T>Share your account ID with the business owner or admin so they can add you. They must assign a business role before you can open the workspace.</T></p>
      <div className="rounded-xl border border-border bg-surface p-5"><p><T>Your account ID</T></p><p className="mt-2 break-all font-mono" dir="ltr">{userId}</p></div>
      <h2 className="text-xl font-semibold"><T>Your businesses</T></h2>
      {memberships.length === 0 && <p><T>You have not joined a business yet. Ask the owner or admin to add your account, then reload this page.</T></p>}
      <ul className="space-y-5">{memberships.map((organization) => (
        <li key={organization.id} className="space-y-4 rounded-xl border border-border bg-surface p-5">
          <h3 className="break-words text-lg font-semibold" dir="auto">{organization.name}</h3>
          <OrganizationActivation organizationId={organization.id} />
        </li>
      ))}</ul>
      <a href="/join" className="inline-flex min-h-11 items-center text-primary underline focus-visible:outline-2 focus-visible:outline-ring"><T>Reload staff access</T></a>
      <div><SignOut /></div>
    </main>
  );
}
