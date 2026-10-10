import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { validateServerEnvironment } from "./env";

describe("validateServerEnvironment", () => {
  it("rejects an unsupported NODE_ENV with an actionable error", () => {
    expect(() => validateServerEnvironment("preview")).toThrow(
      "Set it to development, production, or test",
    );
  });
});
