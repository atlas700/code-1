import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { assertStatusTransition, localIdSchema, utcTimestampSchema } from "./validation";

describe("local identifiers and UTC timestamps", () => {
  it("accepts local UUIDs and normalizes UTC timestamps without losing precision", () => {
    expect(localIdSchema.parse("53409e5c-e4d7-4351-a6b3-46ee18c4f532")).toBe("53409e5c-e4d7-4351-a6b3-46ee18c4f532");
    expect(utcTimestampSchema.parse("2026-10-28T10:15:00Z")).toBe("2026-10-28T10:15:00.000Z");
    expect(utcTimestampSchema.parse("2024-02-29T10:15:00.12Z")).toBe("2024-02-29T10:15:00.120Z");
    expect(utcTimestampSchema.parse("2026-10-28T10:15:00.123Z")).toBe("2026-10-28T10:15:00.123Z");
  });

  it.each(["org_clerk", "1", "", null, "53409e5c-e4d7-4351-76b3-46ee18c4f532"])("rejects invalid local IDs (%#)", (value) => {
    expect(localIdSchema.safeParse(value).success).toBe(false);
  });

  it.each([
    "2026-10-28", "2026-10-28T10:15:00", "2026-10-28T10:15:00+04:30", "2026-10-28T10:15Z",
    "2026-02-29T10:15:00Z", "2026-10-28T10:15:00.1234Z", "2026-10-28T25:15:00Z", 1,
  ])("rejects invalid, local, offset, and unsupported-precision timestamps (%#)", (value) => {
    expect(utcTimestampSchema.safeParse(value).success).toBe(false);
  });
});

describe("explicit status transitions", () => {
  const transitions = { draft: ["ordered"], ordered: ["partially_received", "received"], partially_received: ["received"], received: [] } as const;

  it.each([
    ["draft", "ordered"], ["ordered", "partially_received"], ["ordered", "received"], ["partially_received", "received"],
  ])("allows the caller's explicit %s to %s transition", (current, next) => {
    expect(() => assertStatusTransition(current, next, transitions)).not.toThrow();
  });

  it.each([
    ["draft", "received"], ["received", "draft"], ["draft", "draft"], ["unknown", "ordered"],
    ["draft", "unknown"], ["constructor", "ordered"], ["draft", "toString"], [null, "ordered"], ["draft", 1],
  ])("rejects invalid, inherited, reverse, or unspecified transitions (%#)", (current, next) => {
    expect(() => assertStatusTransition(current, next, transitions)).toThrow("not allowed");
  });
});
