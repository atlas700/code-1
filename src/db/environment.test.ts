import { describe, expect, it } from "vitest";
import { validateDatabaseUrl } from "./environment";

describe("validateDatabaseUrl", () => {
  it.each([
    undefined,
    "",
    "private-invalid-value",
    "https://user:private-password@localhost/afcs_dev",
    "postgresql:///afcs_dev",
    "postgresql://localhost/afcs_dev",
    "postgresql://user:private-password@localhost",
    "postgresql://user:private-password@localhost/",
    "postgresql://user:private-password@localhost/afcs_dev#fragment",
    "postgresql://user:private-password@localhost:invalid/afcs_dev",
    "postgresql://user:private%zz@localhost/afcs_dev",
    "postgresql://user:private-password@localhost/afcs%zz",
  ])("rejects missing or malformed configuration (%#) without exposing it", (value) => {
    expect(() => validateDatabaseUrl(value)).toThrow("Set DATABASE_URL");
    expect(() => validateDatabaseUrl(value)).not.toThrow("private");
  });

  it.each([
    "postgresql://afcs_dev:placeholder@localhost:5432/afcs_dev",
    "postgres://afcs_dev@127.0.0.1/afcs_dev",
    "postgresql://afcs_dev:p%40ss@localhost/afcs_dev?sslmode=require",
  ])("preserves valid URLs and driver options (%#)", (value) => {
    expect(validateDatabaseUrl(value)).toBe(value);
  });
});
