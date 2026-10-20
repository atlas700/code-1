import { afterEach, describe, expect, it, vi } from "vitest";

const { getSession, redirect } = vi.hoisted(() => ({
  getSession: vi.fn(),
  redirect: vi.fn(),
}));
vi.mock("@/auth/server", () => ({ getSession }));
vi.mock("@/auth/components", () => ({ SignIn: () => null }));
vi.mock("next/navigation", () => ({ redirect }));

import SignInPage from "../app/sign-in/[[...sign-in]]/page";

afterEach(() => vi.resetAllMocks());

describe("sign-in page", () => {
  it("allows signed-out users to reach sign-in", async () => {
    getSession.mockResolvedValue(null);
    expect(await SignInPage()).toBeTruthy();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("sends an authenticated user to the workspace", async () => {
    getSession.mockResolvedValue({ userId: "user_123" });
    const destination = new Error("Dashboard redirect");
    redirect.mockImplementation(() => {
      throw destination;
    });
    await expect(SignInPage()).rejects.toBe(destination);
    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });
});
