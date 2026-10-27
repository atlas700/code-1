import { redirect } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ requireSession: vi.fn(), manageStaff: vi.fn(), revalidatePath: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/auth/server", () => mocks);
vi.mock("@/db/staff", () => mocks);
vi.mock("next/cache", () => mocks);
import { updateStaff } from "./actions";

beforeEach(() => { mocks.requireSession.mockResolvedValue({ userId: "user_a" }); mocks.manageStaff.mockResolvedValue({ status: "success" }); });
afterEach(() => { vi.resetAllMocks(); vi.restoreAllMocks(); });

describe("staff Server Action", () => {
  it("authenticates and forwards only explicit untrusted fields, ignoring client authority", async () => {
    const form = new FormData();
    form.set("operation", "role"); form.set("role", "manager"); form.set("membershipId", "member_target");
    form.set("organizationId", "attacker"); form.set("actorUserId", "attacker");
    expect(await updateStaff({ status: "success" }, form)).toEqual({ status: "success" });
    expect(mocks.requireSession).toHaveBeenCalledOnce();
    expect(mocks.manageStaff).toHaveBeenCalledWith({ operation: "role", role: "manager", membershipId: "member_target", emailAddress: null, userId: null, invitationId: null });
    expect(mocks.revalidatePath).toHaveBeenCalledExactlyOnceWith("/settings/staff");
  });
  it("preserves anonymous redirects and authorization denials", async () => {
    mocks.requireSession.mockImplementation(() => redirect("/sign-in"));
    await expect(updateStaff({ status: "idle" }, new FormData())).rejects.toHaveProperty("digest", expect.stringContaining("NEXT_REDIRECT"));
    expect(mocks.manageStaff).not.toHaveBeenCalled();
    mocks.requireSession.mockResolvedValue({ userId: "user_a" });
    mocks.manageStaff.mockRejectedValue({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" });
    await expect(updateStaff({ status: "idle" }, new FormData())).rejects.toHaveProperty("digest", "NEXT_HTTP_ERROR_FALLBACK;404");
  });
  it("returns safe correlated errors without logging submitted data or caught errors", async () => {
    const diagnostic = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.manageStaff.mockRejectedValue(new Error("secret SQL email account password"));
    const result = await updateStaff({ status: "idle" }, new FormData());
    expect(result).toEqual({ status: "error", correlationId: expect.stringMatching(/^[0-9a-f-]{36}$/) });
    expect(JSON.stringify(diagnostic.mock.calls)).not.toMatch(/secret|password|SQL|email/);
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
  it("returns conflicts without refreshing and validates malformed payloads in the server operation", async () => {
    mocks.manageStaff.mockResolvedValue({ status: "last-owner" });
    expect(await updateStaff({ status: "idle" }, new FormData())).toEqual({ status: "last-owner" });
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
    // @ts-expect-error Exercise the untrusted Server Action transport.
    await updateStaff({ status: "idle" }, null);
    expect(mocks.manageStaff).toHaveBeenLastCalledWith(null);
  });
});
