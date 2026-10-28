import "server-only";
import { formatDecimal, parseNonNegativeDecimal } from "./decimal";

export const pilotWeightMeasures = { kg: "1.000", maan: "4.400", khorwar: "440.000" } as const;

export function parseWeight(value: unknown): bigint {
  const grams = parseNonNegativeDecimal(value, 3);
  if (grams === BigInt(0)) throw new RangeError("A measure's weight must be positive.");
  return grams;
}

export function normalizeQuantityKg(value: unknown): string {
  return formatDecimal(parseNonNegativeDecimal(value, 3), 3);
}

export function quantityToKg(quantity: unknown, kilogramsPerMeasure: unknown): string {
  const count = parseNonNegativeDecimal(quantity, 18);
  const grams = count * parseWeight(kilogramsPerMeasure);
  const countScale = BigInt(10) ** BigInt(18);
  if (grams % countScale !== BigInt(0)) throw new RangeError("Stock weight must be accurate to a whole gram.");
  return formatDecimal(grams / countScale, 3);
}
