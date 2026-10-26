import "server-only";

import { randomUUID } from "node:crypto";

export function logOnboardingFailure(stage: string) {
  const correlationId = randomUUID();
  console.error({ event: "organization_onboarding_failed", stage, correlationId });
  return correlationId;
}
