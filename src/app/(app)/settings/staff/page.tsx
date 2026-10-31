import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { T } from "gt-next";
import { businessRoles, type BusinessRole } from "@/auth/permissions";
import { getStaffWorkspace } from "@/db/staff";
import { StaffForm } from "./_components/staff-form";
import { ArrowLeft } from "lucide-react";
import { PageHeader, Panel } from "@/components/workspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";

export const metadata: Metadata = { title: "Staff" };

const roleLabels: Record<BusinessRole, ReactNode> = {
  owner: <T>Owner</T>, admin: <T>Admin</T>, manager: <T>Manager</T>, warehouse: <T>Warehouse</T>,
  sales: <T>Sales</T>, accountant: <T>Accountant</T>, viewer: <T>Viewer</T>,
};

export default async function StaffPage() {
  const { members, invitations, canManageOwners } = await getStaffWorkspace();
  return (
    <div className="space-y-8">
      <div>
        <Link href="/settings" className="mb-4 inline-flex min-h-11 items-center gap-2 text-sm text-ink-muted hover:text-primary"><ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" /><T>Settings</T></Link>
        <PageHeader title={<T>People & access</T>} />
        <p className="mt-3 max-w-2xl leading-7 text-ink-muted"><T>Add staff to this business, then assign their business role. Joining alone gives no access to business data.</T></p>
      </div>
      <Panel className="space-y-4" aria-labelledby="add-staff">
        <h2 id="add-staff" className="text-lg font-semibold"><T>Add an existing account</T></h2>
        <p className="text-sm leading-7 text-ink-muted"><T>Ask the staff member to sign in and open Staff access. They can share their account ID with you. This method sends no email or SMS.</T></p>
        <StaffForm>
          <input type="hidden" name="operation" value="add" />
          <Field className="flex-1 basis-52"><FieldLabel htmlFor="staff-user-id"><T>Staff account ID</T></FieldLabel>
            <Input id="staff-user-id" name="userId" dir="ltr" required maxLength={200} pattern="user_[A-Za-z0-9_]+" />
          </Field>
          <Button type="submit"><T>Add account</T></Button>
        </StaffForm>
      </Panel>
      <Panel className="space-y-4" aria-labelledby="invite-staff">
        <h2 id="invite-staff" className="text-lg font-semibold"><T>Invite by email</T></h2>
        <p className="text-sm leading-7 text-ink-muted"><T>Send an email invitation when invitations are enabled. Invitations expire after 30 days. After joining, staff need a business role to open the workspace.</T></p>
        <StaffForm>
          <input type="hidden" name="operation" value="invite" />
          <Field className="flex-1 basis-52"><FieldLabel htmlFor="staff-email"><T>Email address</T></FieldLabel>
            <Input id="staff-email" name="emailAddress" type="email" dir="ltr" required maxLength={254} autoComplete="email" />
          </Field>
          <Button type="submit"><T>Send invitation</T></Button>
        </StaffForm>
      </Panel>
      <Panel className="space-y-4" aria-labelledby="current-staff">
        <h2 id="current-staff" className="text-lg font-semibold"><T>Current staff</T></h2>
        <p className="text-sm leading-7 text-ink-muted"><T>Deactivation removes membership. Rejoining requires a new business-role assignment. Only owners can change ownership; keep at least one active owner.</T></p>
        <ul className="space-y-4">
          {members.map((member) => (
            <li key={member.membershipId} className="space-y-3 rounded-xl bg-page/70 p-4">
              <p className="break-all font-semibold" dir="auto">{member.identifier}</p>
              <p className="break-all text-sm text-ink-muted" dir="ltr">{member.userId}</p>
              <p>{member.role ? roleLabels[member.role] : <T>No business access</T>}</p>
              {(member.role !== "owner" || canManageOwners) && <StaffForm>
                <input type="hidden" name="membershipId" value={member.membershipId} />
                <Field className="flex-1 basis-52"><FieldLabel htmlFor={`role-${member.membershipId}`}><T>Business role</T></FieldLabel>
                  <Select name="role" defaultValue={member.role ?? "viewer"}>
                    <SelectTrigger id={`role-${member.membershipId}`}><SelectValue /></SelectTrigger>
                    <SelectContent>{businessRoles.filter((role) => role !== "owner" || canManageOwners).map((role) => <SelectItem key={role} value={role}>{roleLabels[role]}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Button type="submit" name="operation" value="role"><T>Save role</T></Button>
                <Button variant="destructive" type="submit" name="operation" value="deactivate"><T>Deactivate membership</T></Button>
              </StaffForm>}
            </li>
          ))}
        </ul>
      </Panel>
      <Panel className="space-y-4" aria-labelledby="pending-invitations">
        <h2 id="pending-invitations" className="text-lg font-semibold"><T>Pending invitations</T></h2>
        {invitations.length === 0 && <p><T>No pending invitations.</T></p>}
        <ul className="space-y-4">{invitations.map((invitation) => (
          <li key={invitation.id} className="space-y-3 rounded-xl bg-page/70 p-4">
            <p className="break-all" dir="auto">{invitation.emailAddress}</p>
            <p><T>Expires: <time dateTime={invitation.expiresAt}>{invitation.expiresAt.slice(0, 10)} UTC</time></T></p>
            <StaffForm>
              <input type="hidden" name="operation" value="revoke" />
              <input type="hidden" name="invitationId" value={invitation.id} />
              <Button type="submit"><T>Revoke invitation</T></Button>
            </StaffForm>
          </li>
        ))}</ul>
      </Panel>
    </div>
  );
}
