import { afterAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

// Nonfunctional keys for configuration tests; no Clerk instance is contacted.
const configuration = {
  NODE_ENV: "test",
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_Y2xlcmsuZXhhbXBsZS5pbnZhbGlkJA==",
  CLERK_SECRET_KEY: "sk_test_unitTestPlaceholder",
  DATABASE_URL: "postgresql://test:placeholder@127.0.0.1:1/afcs_test",
};

vi.stubEnv(
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  configuration.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
);
vi.stubEnv("CLERK_SECRET_KEY", configuration.CLERK_SECRET_KEY);
vi.stubEnv("DATABASE_URL", configuration.DATABASE_URL);
const { validateServerEnvironment } = await import("./env");
afterAll(() => vi.unstubAllEnvs());

describe("validateServerEnvironment", () => {
  it("requires DATABASE_URL at startup without exposing invalid values", () => {
    for (const value of [undefined, "private-invalid-value"]) {
      const validate = () =>
        validateServerEnvironment({ ...configuration, DATABASE_URL: value });
      expect(validate).toThrow("DATABASE_URL");
      expect(validate).not.toThrow("private-invalid-value");
    }
    expect(validateServerEnvironment(configuration).databaseUrl).toBe(
      configuration.DATABASE_URL,
    );
  });

  it("rejects an unsupported NODE_ENV with an actionable error", () => {
    expect(() =>
      validateServerEnvironment({ ...configuration, NODE_ENV: "preview" }),
    ).toThrow("Set it to development, production, or test");
  });

  it("accepts development keys and defaults to the local origin", () => {
    expect(validateServerEnvironment(configuration).appOrigin).toBe(
      "http://localhost:3000",
    );
  });

  it.each(["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "CLERK_SECRET_KEY"])(
    "rejects missing or malformed %s without exposing its value",
    (name) => {
      for (const value of [undefined, "private-invalid-value"]) {
        const validate = () =>
          validateServerEnvironment({ ...configuration, [name]: value });
        expect(validate).toThrow(name);
        expect(validate).not.toThrow("private-invalid-value");
      }
    },
  );

  it("rejects mixing live and test keys", () => {
    expect(() =>
      validateServerEnvironment({
        ...configuration,
        CLERK_SECRET_KEY: "sk_live_placeholder",
      }),
    ).toThrow("both be test keys or both be live keys");
  });

  it.each([
    "not-a-url",
    "ftp://localhost",
    "https://example.com/path",
    "https://example.com/",
    "https://user:password@example.com",
  ])("rejects an invalid origin: %s", (appOrigin) => {
    expect(() =>
      validateServerEnvironment({ ...configuration, APP_ORIGIN: appOrigin }),
    ).toThrow("APP_ORIGIN");
  });

  it("requires HTTPS for live Clerk instances", () => {
    expect(() =>
      validateServerEnvironment({
        ...configuration,
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_live_Y2xlcmsuZXhhbXBsZS5pbnZhbGlkJA==",
        CLERK_SECRET_KEY: "sk_live_placeholder",
      }),
    ).toThrow("require HTTPS");
  });

  it("accepts live keys with an explicit HTTPS origin", () => {
    expect(
      validateServerEnvironment({
        ...configuration,
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_live_Y2xlcmsuZXhhbXBsZS5pbnZhbGlkJA==",
        CLERK_SECRET_KEY: "sk_live_placeholder",
        APP_ORIGIN: "https://example.com",
      }).appOrigin,
    ).toBe("https://example.com");
  });
});
