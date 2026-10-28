import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { normalizeQuantityKg, parseWeight, pilotWeightMeasures, quantityToKg } from "./quantity";

describe("gram-precise stock", () => {
  it.each([
    ["1", pilotWeightMeasures.kg, "1.000"], ["0.001", pilotWeightMeasures.kg, "0.001"],
    ["0.5", pilotWeightMeasures.maan, "2.200"], ["1", pilotWeightMeasures.khorwar, "440.000"],
    ["2", "44", "88.000"], ["2", "48.4", "96.800"],
    ["0.0025", pilotWeightMeasures.maan, "0.011"], ["0.000025", pilotWeightMeasures.khorwar, "0.011"],
    ["0.004", "2.500", "0.010"], ["0", "1", "0.000"],
    ["9007199254740993", "1", "9007199254740993.000"],
  ])("converts %s measures of %s kg to %s kg", (count, weight, expected) => {
    expect(quantityToKg(count, weight)).toBe(expected);
  });

  it.each([
    ["-1", "1"], ["1", "-1"], ["1", "0"], ["1", "0.0001"],
    ["0.0001", "1"], ["0.001", "4.4"], ["1", undefined], [1, "1"],
    ["1.0000000000000000000", "1"], ["999999999999999999", "440"],
  ])("rejects invalid measures, negative quantities, sub-gram stock, and overflow (%#)", (count, weight) => {
    expect(() => quantityToKg(count, weight)).toThrow();
  });

  it("normalizes stock quantities and validates positive custom measure weights", () => {
    expect(normalizeQuantityKg("1.2")).toBe("1.200");
    expect(normalizeQuantityKg("0")).toBe("0.000");
    expect(parseWeight("4.4")).toBe(BigInt(4400));
    expect(() => parseWeight("0")).toThrow("positive");
    expect(() => normalizeQuantityKg("-0.001")).toThrow("negative");
    expect(() => normalizeQuantityKg("0.0001")).toThrow("precision");
  });
});
