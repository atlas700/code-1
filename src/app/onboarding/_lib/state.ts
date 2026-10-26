export type OnboardingState =
  | { status: "idle" }
  | { status: "invalid"; fields: string[] }
  | { status: "conflict" }
  | { status: "denied" }
  | { status: "error"; correlationId: string }
  | { status: "success"; clerkOrganizationId: string };
