import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { StaffState } from "@/db/staff";

const mocks = vi.hoisted(() => ({ getStaffWorkspace: vi.fn(), getState: vi.fn<() => StaffState>(), pending: false }));
vi.mock("@/db/staff", () => mocks);
vi.mock("./actions", () => ({ updateStaff: vi.fn() }));
vi.mock("gt-next", () => ({ T: ({ children }: { children: ReactNode }) => children }));
vi.mock("react", async (original) => ({
  ...await original<typeof import("react")>(), useActionState: () => [mocks.getState(), () => {}, mocks.pending],
}));

import StaffPage from "./page";
import { StaffForm } from "./_components/staff-form";

beforeEach(() => {
  mocks.getState.mockReturnValue({ status: "idle" });
  mocks.getStaffWorkspace.mockResolvedValue({ canManageOwners: false, members: [
    { userId: "user_owner", membershipId: "member_owner", identifier: "Owner", role: "owner" },
    { userId: "user_staff", membershipId: "member_staff", identifier: "Staff", role: null },
  ], invitations: [] });
});
afterEach(() => { vi.resetAllMocks(); mocks.pending = false; });

describe("staff page and form", () => {
  it("does not render or read staff after a permission denial", async () => {
    mocks.getStaffWorkspace.mockRejectedValue(new Error("denied"));
    await expect(StaffPage()).rejects.toThrow("denied");
  });
  it("labels manual and email inputs and hides owner controls from admins", async () => {
    const markup = renderToStaticMarkup(await StaffPage());
    expect(markup).toContain('for="staff-user-id"');
    expect(markup).toContain('for="staff-email"');
    expect(markup).toContain("No business access");
    expect(markup).not.toContain('value="member_owner"');
    expect(markup).not.toContain('<option value="owner"');
    expect(markup).toContain('for="role-member_staff"');
    expect(markup).toContain("30 days");
  });
  it("offers ownership changes only to owners", async () => {
    const data = await mocks.getStaffWorkspace();
    mocks.getStaffWorkspace.mockResolvedValue({ ...data, canManageOwners: true });
    const markup = renderToStaticMarkup(await StaffPage());
    expect(markup).toContain('value="member_owner"');
    expect(markup).toContain('<option value="owner"');
  });
  it("disables controls while pending and announces safe feedback", () => {
    mocks.pending = true;
    let markup = renderToStaticMarkup(<StaffForm><button type="submit">Save</button></StaffForm>);
    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain('<fieldset disabled=""');
    mocks.pending = false;
    mocks.getState.mockReturnValue({ status: "last-owner" });
    markup = renderToStaticMarkup(<StaffForm><button type="submit">Save</button></StaffForm>);
    expect(markup).toContain('role="alert"');
    expect(markup).toContain("Keep at least one active owner");
    mocks.getState.mockReturnValue({ status: "error", correlationId: "safe-reference" });
    expect(renderToStaticMarkup(<StaffForm>Save</StaffForm>)).toContain("safe-reference");
  });
});
