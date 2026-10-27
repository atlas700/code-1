import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { T } from "gt-next";
import { businessRoles, type BusinessRole } from "@/auth/permissions";
import { getStaffWorkspace } from "@/db/staff";
import { StaffForm } from "./_components/staff-form";

export const metadata: Metadata = { title: "Staff" };

const inputClass = "mt-2 min-h-11 w-full rounded-lg border border-border bg-surface px-3 text-base text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const buttonClass = "min-h-11 rounded-lg border border-border px-4 font-semibold text-ink hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60";
const roleLabels: Record<BusinessRole, ReactNode> = {
  owner: <T>Owner</T>, admin: <T>Admin</T>, manager: <T>Manager</T>, warehouse: <T>Warehouse</T>,
  sales: <T>Sales</T>, accountant: <T>Accountant</T>, viewer: <T>Viewer</T>,
};

export default async function StaffPage() {
  const { members, invitations, canManageOwners } = await getStaffWorkspace();
  return (
    <div className="space-y-8 text-ink">
      <div>
        <Link href="/settings" className="text-primary underline focus-visible:outline-2 focus-visible:outline-ring"><T>Settings</T></Link>
        <h1 className="mt-3 text-3xl font-semibold"><T>Staff</T></h1>
        <p className="mt-3 max-w-2xl leading-7 text-ink-muted"><T>Add staff to this business, then assign their business role. Joining alone gives no access to business data.</T></p>
      </div>
      <section className="space-y-4 rounded-xl border border-border bg-surface p-5" aria-labelledby="add-staff">
        <h2 id="add-staff" className="text-xl font-semibold"><T>Add an existing account</T></h2>
        <p className="leading-7 text-ink-muted"><T>Ask the staff member to sign in and open Staff access at /join. They can share their account ID with you. This method sends no email or SMS.</T></p>
        <StaffForm>
          <input type="hidden" name="operation" value="add" />
          <div className="min-w-0 flex-1"><label htmlFor="staff-user-id"><T>Staff account ID</T></label>
            <input id="staff-user-id" name="userId" dir="ltr" required maxLength={200} pattern="user_[A-Za-z0-9_]+" className={inputClass} />
          </div>
          <button className={buttonClass} type="submit"><T>Add account</T></button>
        </StaffForm>
      </section>
      <section className="space-y-4 rounded-xl border border-border bg-surface p-5" aria-labelledby="invite-staff">
        <h2 id="invite-staff" className="text-xl font-semibold"><T>Invite by email</T></h2>
        <p className="leading-7 text-ink-muted"><T>Clerk sends an invitation when email invitations are enabled. Invitations expire after 30 days. After joining, staff must open /join and receive a business role here.</T></p>
        <StaffForm>
          <input type="hidden" name="operation" value="invite" />
          <div className="min-w-0 flex-1"><label htmlFor="staff-email"><T>Email address</T></label>
            <input id="staff-email" name="emailAddress" type="email" dir="ltr" required maxLength={254} autoComplete="email" className={inputClass} />
          </div>
          <button className={buttonClass} type="submit"><T>Send invitation</T></button>
        </StaffForm>
      </section>
      <section className="space-y-4" aria-labelledby="current-staff">
        <h2 id="current-staff" className="text-xl font-semibold"><T>Current staff</T></h2>
        <p className="leading-7 text-ink-muted"><T>Deactivation removes membership. Rejoining requires a new business-role assignment. Only owners can change ownership; keep at least one active owner.</T></p>
        <ul className="space-y-4">
          {members.map((member) => (
            <li key={member.membershipId} className="space-y-3 rounded-xl border border-border bg-surface p-5">
              <p className="break-all font-semibold" dir="auto">{member.identifier}</p>
              <p className="break-all text-sm text-ink-muted" dir="ltr">{member.userId}</p>
              <p>{member.role ? roleLabels[member.role] : <T>No business access</T>}</p>
              {(member.role !== "owner" || canManageOwners) && <StaffForm>
                <input type="hidden" name="membershipId" value={member.membershipId} />
                <div className="min-w-0 flex-1"><label htmlFor={`role-${member.membershipId}`}><T>Business role</T></label>
                  <select id={`role-${member.membershipId}`} name="role" defaultValue={member.role ?? "viewer"} className={inputClass}>
                    {businessRoles.filter((role) => role !== "owner" || canManageOwners).map((role) => <option key={role} value={role}>{roleLabels[role]}</option>)}
                  </select>
                </div>
                <button className={buttonClass} type="submit" name="operation" value="role"><T>Save role</T></button>
                <button className={buttonClass} type="submit" name="operation" value="deactivate"><T>Deactivate membership</T></button>
              </StaffForm>}
            </li>
          ))}
        </ul>
      </section>
      <section className="space-y-4" aria-labelledby="pending-invitations">
        <h2 id="pending-invitations" className="text-xl font-semibold"><T>Pending invitations</T></h2>
        {invitations.length === 0 && <p><T>No pending invitations.</T></p>}
        <ul className="space-y-4">{invitations.map((invitation) => (
          <li key={invitation.id} className="space-y-3 rounded-xl border border-border bg-surface p-5">
            <p className="break-all" dir="auto">{invitation.emailAddress}</p>
            <p><T>Expires: <time dateTime={invitation.expiresAt}>{invitation.expiresAt.slice(0, 10)} UTC</time></T></p>
            <StaffForm>
              <input type="hidden" name="operation" value="revoke" />
              <input type="hidden" name="invitationId" value={invitation.id} />
              <button className={buttonClass} type="submit"><T>Revoke invitation</T></button>
            </StaffForm>
          </li>
        ))}</ul>
      </section>
    </div>
  );
}
