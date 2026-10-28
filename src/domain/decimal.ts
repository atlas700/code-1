import "server-only";
import { z } from "zod";

const decimalInput = z.string().max(38).regex(/^-?\d{1,18}(?:\.\d{1,18})?$/);
const zero = BigInt(0);
const ten = BigInt(10);
const integerLimit = ten ** BigInt(18);

function scale(places: number): bigint {
  if (!Number.isInteger(places) || places < 0 || places > 18) {
    throw new RangeError("Decimal precision must be between 0 and 18.");
  }
  return ten ** BigInt(places);
}

export function parseDecimal(value: unknown, places: number): bigint {
  const factor = scale(places);
  const parsed = decimalInput.safeParse(value);
  if (!parsed.success) throw new Error("Enter a plain decimal with at most 18 integer digits.");
  const negative = parsed.data.startsWith("-");
  const [whole, fraction = ""] = parsed.data.replace(/^-/, "").split(".");
  if (fraction.length > places) throw new RangeError("Unsupported decimal precision.");
  const magnitude = BigInt(whole) * factor + BigInt(fraction.padEnd(places, "0") || "0");
  return negative ? -magnitude : magnitude;
}

export function parseNonNegativeDecimal(value: unknown, places: number): bigint {
  const parsed = parseDecimal(value, places);
  if (parsed < zero) throw new RangeError("The amount or quantity cannot be negative.");
  return parsed;
}

export function formatDecimal(value: bigint, places: number): string {
  const factor = scale(places);
  const magnitude = value < zero ? -value : value;
  if (magnitude / factor >= integerLimit) throw new RangeError("The result exceeds 18 integer digits.");
  const sign = value < zero ? "-" : "";
  const whole = (magnitude / factor).toString();
  return places === 0 ? `${sign}${whole}` : `${sign}${whole}.${(magnitude % factor).toString().padStart(places, "0")}`;
}

// Keep ratios exact until the owning monetary operation's final rounding step.
export function roundHalfUp(numerator: bigint, denominator: bigint): bigint {
  if (denominator <= zero) throw new RangeError("The denominator must be positive.");
  const magnitude = numerator < zero ? -numerator : numerator;
  const rounded = magnitude / denominator + (magnitude % denominator * BigInt(2) >= denominator ? BigInt(1) : zero);
  return numerator < zero ? -rounded : rounded;
}
