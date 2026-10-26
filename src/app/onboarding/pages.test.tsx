import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ requireSession: vi.fn(), getTenantContext: vi.fn(), getOnboardingRequest: vi.fn(), getLocale: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/auth/server", () => mocks);
vi.mock("@/db/tenant", () => mocks);
vi.mock("@/db/onboarding", () => mocks);
vi.mock("gt-next/server", () => mocks);
vi.mock("@/auth/components", () => ({ SignOut: () => null }));
vi.mock("./_components/onboarding-form", () => ({ OnboardingForm: () => null }));

import AppLayout from "../(app)/layout";
import OnboardingPage from "./page";

beforeEach(() => {
  mocks.requireSession.mockResolvedValue({ userId: "user_a" });
  mocks.getTenantContext.mockResolvedValue(null);
  mocks.getOnboardingRequest.mockResolvedValue(null);
  mocks.getLocale.mockResolvedValue("en-US");
});
afterEach(() => { vi.resetAllMocks(); vi.restoreAllMocks(); });

describe("onboarding routing", () => {
  it("takes authenticated users without an active local business to onboarding", async () => {
    await expect(AppLayout({ children: "Workspace" })).rejects.toHaveProperty("digest", expect.stringContaining("/onboarding"));
    expect(mocks.getTenantContext).toHaveBeenCalledOnce();
  });

  it("renders the workspace for a verified local tenant", async () => {
    mocks.getTenantContext.mockResolvedValue({ userId: "user_a", organizationId: "local_a", membershipId: "member_a" });
    expect(await AppLayout({ children: "Workspace" })).toBeTruthy();
  });

  it("denies layout access without authentication before looking up tenant context", async () => {
    mocks.requireSession.mockRejectedValue(new Error("Sign-in required"));
    await expect(AppLayout({ children: "Workspace" })).rejects.toThrow("Sign-in required");
    expect(mocks.getTenantContext).not.toHaveBeenCalled();
  });

  it("denies onboarding without authentication before reading saved setup", async () => {
    mocks.requireSession.mockRejectedValue(new Error("Sign-in required"));
    await expect(OnboardingPage()).rejects.toThrow("Sign-in required");
    expect(mocks.getOnboardingRequest).not.toHaveBeenCalled();
  });

  it("loads only the authenticated creator's saved setup", async () => {
    expect(await OnboardingPage()).toBeTruthy();
    expect(mocks.getOnboardingRequest).toHaveBeenCalledExactlyOnceWith("user_a");
  });

  it("sanitizes database failures while preserving a safe correlated diagnostic", async () => {
    const diagnostic = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.getOnboardingRequest.mockRejectedValue(new Error("Private SQL and user data"));
    await expect(OnboardingPage()).rejects.toThrow(/^Business setup unavailable\. Reference: [0-9a-f-]{36}$/);
    expect(diagnostic).toHaveBeenCalledWith({ event: "organization_onboarding_failed", stage: "load-saved-setup", correlationId: expect.any(String) });
    expect(JSON.stringify(diagnostic.mock.calls)).not.toContain("Private");
  });
});
