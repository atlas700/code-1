import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { formatDecimal, parseDecimal, parseNonNegativeDecimal, roundHalfUp } from "./decimal";

describe("exact decimal boundaries", () => {
  it.each([
    ["0", 2, "0", "0.00"], ["001.2", 2, "120", "1.20"],
    ["-62.79", 2, "-6279", "-62.79"], ["0.001", 3, "1", "0.001"],
    ["0.000001", 6, "1", "0.000001"], ["12", 0, "12", "12"],
    ["9007199254740993.01", 2, "900719925474099301", "9007199254740993.01"],
    ["999999999999999999.99", 2, "99999999999999999999", "999999999999999999.99"],
  ])("parses %s without floating point", (value, places, units, formatted) => {
    const parsed = parseDecimal(value, places);
    expect(parsed).toBe(BigInt(units));
    expect(formatDecimal(parsed, places)).toBe(formatted);
  });

  it.each([undefined, null, true, 1.25, NaN, Infinity, BigInt(1), {}, [], "", " 1", "1 ",
    "1e2", "1,000", "+1", ".5", "1.", "--1", "NaN", "Infinity", "١", "1\n",
    "1000000000000000000", "1".repeat(10000),
  ])("rejects non-decimal or oversized input (%#)", (value) => {
    expect(() => parseDecimal(value, 2)).toThrow();
  });

  it.each([["1.000", 2], ["0.0001", 3], ["4.0000000", 6], ["1.0", 0]])(
    "rejects unsupported precision without trimming zeros (%s)", (value, places) => {
      expect(() => parseDecimal(value, places)).toThrow("precision");
    },
  );

  it.each([-1, 19, 1.5, NaN, Infinity])("rejects invalid precision %s", (places) => {
    expect(() => parseDecimal("1", places)).toThrow("precision");
    expect(() => formatDecimal(BigInt(1), places)).toThrow("precision");
  });

  it("rejects negative quantities and bounded-result overflow", () => {
    expect(() => parseNonNegativeDecimal("-0.001", 3)).toThrow("negative");
    expect(() => formatDecimal(BigInt("100000000000000000000"), 2)).toThrow("18 integer digits");
  });
});

describe("half-up rounding of exact ratios", () => {
  it.each([
    ["62785", "10", "6279"], ["-62785", "10", "-6279"],
    ["1", "2", "1"], ["-1", "2", "-1"], ["49", "100", "0"],
    ["-49", "100", "0"], ["100", "3", "33"], ["200", "3", "67"], ["0", "1", "0"],
  ])("rounds %s / %s to %s", (numerator, denominator, expected) => {
    expect(roundHalfUp(BigInt(numerator), BigInt(denominator))).toBe(BigInt(expected));
  });

  it.each(["0", "-1"])("rejects a non-positive denominator (%s)", (denominator) => {
    expect(() => roundHalfUp(BigInt(1), BigInt(denominator))).toThrow("positive");
  });
});
