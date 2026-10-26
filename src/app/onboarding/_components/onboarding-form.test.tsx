import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { OnboardingState } from "../_lib/state";

const state = vi.hoisted((): { value: OnboardingState; pending: boolean } => ({ value: { status: "idle" }, pending: false }));
vi.mock("react", async (importOriginal) => ({
  ...await importOriginal<typeof import("react")>(),
  useActionState: () => [state.value, () => {}, state.pending],
}));
vi.mock("gt-next", () => ({ T: ({ children }: { children: ReactNode }) => children }));
vi.mock("../actions", () => ({ createFirstOrganization: vi.fn() }));
vi.mock("@/auth/organization-activation", () => ({
  OrganizationActivation: ({ organizationId }: { organizationId: string }) => <span data-activation={organizationId} />,
}));

import { OnboardingForm } from "./onboarding-form";

const initialValues = { name: "Example business", businessType: "Wholesaler", timezone: "Asia/Kabul", baseCurrency: "AFN", locale: "en-US" };
afterEach(() => { state.value = { status: "idle" }; state.pending = false; });

describe("onboarding form feedback", () => {
  it("renders labelled business inputs and offers activation only after server success", () => {
    const markup = renderToStaticMarkup(<OnboardingForm initialValues={initialValues} resuming={false} />);
    for (const field of ["name", "businessType", "timezone", "baseCurrency", "locale"]) expect(markup).toContain(`for="${field}"`);
    expect(markup).not.toContain("data-activation");
    state.value = { status: "success", clerkOrganizationId: "org_a" };
    expect(renderToStaticMarkup(<OnboardingForm initialValues={initialValues} resuming={false} />)).toContain('data-activation="org_a"');
  });

  it("links the focusable validation summary to the invalid fields and their messages", () => {
    state.value = { status: "invalid", fields: ["name", "timezone"] };
    const markup = renderToStaticMarkup(<OnboardingForm initialValues={initialValues} resuming={false} />);
    expect(markup).toContain('tabindex="-1" role="alert"');
    for (const field of ["name", "timezone"]) {
      expect(markup).toContain(`href="#${field}"`);
      expect(markup).toContain(`aria-describedby="${field}-error"`);
    }
    expect(markup).toContain('value="Example business"');
  });

  it("keeps the submit control disabled while setup is pending", () => {
    state.pending = true;
    const markup = renderToStaticMarkup(<OnboardingForm initialValues={initialValues} resuming={true} />);
    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain('type="submit" disabled=""');
    expect(markup).toContain("Setting up business…");
  });
});
