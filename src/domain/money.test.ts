import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { allocateCashPayment, calculateLineTotal, calculateReceiptValue, currencySchema, normalizeMoney, sumLineTotals, validateRoundingReduction } from "./money";

const line = { quantity: "1", quantityMeasureKg: "1", unitPrice: "100", priceMeasureKg: "3" };
const receipt = { previousQuantityKg: "0", cumulativeQuantityKg: "1", previouslyRecognized: "0", unitPrice: "100", priceMeasureKg: "3" };
const cash = { debtCurrency: "AFN", afnCash: "62", pkrCash: "3", pkrPerAfn: "4" };
const reduction = { previousReductions: "0.20", reduction: "0.79", outstandingBalance: "0.79" };

describe("purchase money", () => {
  it.each(["AFN", "PKR"])("accepts %s and keeps numeric results currency-neutral", (currency) => {
    expect(currencySchema.parse(currency)).toBe(currency);
    expect(normalizeMoney("62.7")).toBe("62.70");
    expect(calculateLineTotal(line)).toBe("33.33");
  });

  it("rejects unsupported currencies and invalid money", () => {
    expect(currencySchema.safeParse("USD").success).toBe(false);
    expect(() => normalizeMoney("-0.01")).toThrow();
    expect(() => normalizeMoney("1.001")).toThrow();
    expect(normalizeMoney("0")).toBe("0.00");
  });

  it("preserves separate quantity and price measures and exact derived prices", () => {
    expect(calculateLineTotal({ ...line, quantity: "2", quantityMeasureKg: "44", unitPrice: "100", priceMeasureKg: "4.4" })).toBe("2000.00");
    expect(calculateLineTotal({ ...line, quantity: "3" })).toBe("100.00");
    expect(calculateLineTotal({ ...line, quantity: "0.5", unitPrice: "125.57", priceMeasureKg: "1" })).toBe("62.79");
    expect(calculateLineTotal({ ...line, unitPrice: "0" })).toBe("0.00");
  });

  it("sums rounded lines rather than rounding an unrounded aggregate", () => {
    const halfCent = { quantity: "0.001", quantityMeasureKg: "1", unitPrice: "5", priceMeasureKg: "1" };
    expect(calculateLineTotal(halfCent)).toBe("0.01");
    expect(sumLineTotals([calculateLineTotal(halfCent), calculateLineTotal(halfCent)])).toBe("0.02");
    expect(calculateLineTotal({ ...halfCent, quantity: "0.002" })).toBe("0.01");
    expect(sumLineTotals([])).toBe("0.00");
  });

  it.each([
    { ...line, quantity: "-1" }, { ...line, quantity: "0.0001" }, { ...line, unitPrice: "-1" },
    { ...line, unitPrice: "1.000" }, { ...line, priceMeasureKg: "0" },
    { ...line, unitPrice: "999999999999999999", quantity: "4" }, {}, null,
  ])("rejects invalid priced weights and monetary overflow (%#)", (input) => {
    expect(() => calculateLineTotal(input)).toThrow();
  });

  it.each([["-0.01"], ["0.001"], Array.from({ length: 1001 }, () => "0"), ["999999999999999999.99", "0.01"]])(
    "rejects invalid or oversized line totals (%#)", (...amounts) => {
      expect(() => sumLineTotals(amounts)).toThrow();
    },
  );
});

describe("cumulative receipt value", () => {
  it("recognizes 33.33, 33.34, then 33.33 for three 1 kg receipts of a 100 AFN pack", () => {
    const first = calculateReceiptValue(receipt);
    const second = calculateReceiptValue({ ...receipt, previousQuantityKg: "1", cumulativeQuantityKg: "2", previouslyRecognized: first });
    const third = calculateReceiptValue({ ...receipt, previousQuantityKg: "2", cumulativeQuantityKg: "3", previouslyRecognized: "66.67" });
    expect([first, second, third]).toEqual(["33.33", "33.34", "33.33"]);
    expect(sumLineTotals([first, second, third])).toBe("100.00");
  });

  it("keeps zero-cent receipts and approved quantity variances at the same price", () => {
    expect(calculateReceiptValue({ ...receipt, cumulativeQuantityKg: "0.001", unitPrice: "1", priceMeasureKg: "1" })).toBe("0.00");
    expect(calculateReceiptValue({ ...receipt, cumulativeQuantityKg: "4" })).toBe("133.33");
    expect(calculateReceiptValue({ ...receipt, cumulativeQuantityKg: "0" })).toBe("0.00");
  });

  it("rejects cumulative value overflow even when the new receipt delta fits", () => {
    expect(() => calculateReceiptValue({
      ...receipt, previousQuantityKg: "1", cumulativeQuantityKg: "2",
      previouslyRecognized: "999999999999999999", unitPrice: "999999999999999999", priceMeasureKg: "1",
    })).toThrow("18 integer digits");
  });

  it.each([
    { ...receipt, previousQuantityKg: "2", previouslyRecognized: "66.67" },
    { ...receipt, previousQuantityKg: "1", cumulativeQuantityKg: "2", previouslyRecognized: "33.34" },
    { ...receipt, cumulativeQuantityKg: "-1" }, { ...receipt, previousQuantityKg: "0.0001" },
    { ...receipt, previouslyRecognized: "0.001" }, { ...receipt, priceMeasureKg: "0" },
  ])("rejects decreasing, inconsistent, or imprecise receipt state (%#)", (input) => {
    expect(() => calculateReceiptValue(input)).toThrow();
  });
});

describe("recorded whole cash allocation", () => {
  it.each([
    [cash, "62.75"], [{ ...cash, afnCash: "0", pkrCash: "1", pkrPerAfn: "3" }, "0.33"],
    [{ ...cash, afnCash: "1", pkrCash: "2", pkrPerAfn: "3" }, "1.67"],
    [{ ...cash, debtCurrency: "PKR", afnCash: "2", pkrCash: "3", pkrPerAfn: "4.125" }, "11.25"],
    [{ ...cash, debtCurrency: "PKR", afnCash: "1", pkrCash: "0", pkrPerAfn: "0.005" }, "0.01"],
    [{ ...cash, afnCash: "0", pkrCash: "1", pkrPerAfn: "200" }, "0.01"],
    [{ ...cash, afnCash: "0", pkrCash: "1", pkrPerAfn: "0.000001" }, "1000000.00"],
    [{ debtCurrency: "AFN", afnCash: "62", pkrCash: "0" }, "62.00"],
    [{ debtCurrency: "PKR", afnCash: "0", pkrCash: "62" }, "62.00"],
  ])("converts combined cash once (%#)", (input, expected) => {
    expect(allocateCashPayment(input)).toBe(expected);
  });

  it("preserves original cash and the entered rate", () => {
    const input = Object.freeze({ ...cash, pkrPerAfn: "4.000000" });
    expect(allocateCashPayment(input)).toBe("62.75");
    expect(input).toEqual({ debtCurrency: "AFN", afnCash: "62", pkrCash: "3", pkrPerAfn: "4.000000" });
  });

  it.each([
    { ...cash, afnCash: "0", pkrCash: "0" }, { ...cash, afnCash: "-1" },
    { ...cash, afnCash: "1.0" }, { ...cash, pkrCash: "0.5" }, { ...cash, pkrPerAfn: undefined },
    { ...cash, pkrPerAfn: "0" }, { ...cash, pkrPerAfn: "-1" }, { ...cash, pkrPerAfn: "4.0000000" },
    { ...cash, afnCash: "0", pkrCash: "1", pkrPerAfn: "201" },
    { ...cash, debtCurrency: "USD" }, { ...cash, debtCurrency: "PKR", afnCash: "999999999999999999" },
    { ...cash, pkrCash: "0", pkrPerAfn: "invalid" },
  ])("rejects invalid cash, rates, currencies, zero allocations, and overflow (%#)", (input) => {
    expect(() => allocateCashPayment(input)).toThrow();
  });
});

describe("lifetime cash rounding reductions", () => {
  it("allows at most 0.99 over the payable's lifetime without exceeding its balance", () => {
    expect(validateRoundingReduction(reduction)).toBe("0.79");
    expect(validateRoundingReduction({ previousReductions: "0", reduction: "0.99", outstandingBalance: "10" })).toBe("0.99");
  });

  it.each([
    { ...reduction, reduction: "0.80", outstandingBalance: "1" },
    { ...reduction, previousReductions: "0.99", reduction: "0.01" },
    { ...reduction, outstandingBalance: "0.78" }, { ...reduction, reduction: "0" },
    { ...reduction, reduction: "-0.01" }, { ...reduction, previousReductions: "-0.01" },
    { ...reduction, reduction: "0.001" }, { ...reduction, outstandingBalance: "-1" },
  ])("rejects excess, non-positive, or imprecise reductions (%#)", (input) => {
    expect(() => validateRoundingReduction(input)).toThrow();
  });
});
