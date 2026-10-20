import { afterEach, describe, expect, it, vi } from "vitest";

const { requireSession } = vi.hoisted(() => ({ requireSession: vi.fn() }));
vi.mock("@/auth/server", () => ({ requireSession }));

import DashboardPage from "../app/(app)/dashboard/page";
import InventoryPage from "../app/(app)/inventory/page";
import PurchasesPage from "../app/(app)/purchases/page";
import SalesPage from "../app/(app)/sales/page";
import PaymentsPage from "../app/(app)/payments/page";
import SettingsPage from "../app/(app)/settings/page";

afterEach(() => vi.resetAllMocks());

describe.each([
  ["dashboard", DashboardPage],
  ["inventory", InventoryPage],
  ["purchases", PurchasesPage],
  ["sales", SalesPage],
  ["payments", PaymentsPage],
  ["settings", SettingsPage],
])("protected %s page", (_name, Page) => {
  it("does not render when the session guard denies access", async () => {
    const denied = new Error("Sign-in required");
    requireSession.mockRejectedValue(denied);
    await expect(Page()).rejects.toBe(denied);
  });

  it("renders when the session guard accepts the user", async () => {
    requireSession.mockResolvedValue({ userId: "user_123" });
    expect(await Page()).toBeTruthy();
    expect(requireSession).toHaveBeenCalledOnce();
  });
});
