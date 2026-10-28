import "server-only";
import { z } from "zod";
import { formatDecimal, parseNonNegativeDecimal, roundHalfUp } from "./decimal";
import { parseWeight, quantityToKg } from "./quantity";

export const currencySchema = z.enum(["AFN", "PKR"]);
export type Currency = z.infer<typeof currencySchema>;

const pricedWeight = z.object({
  quantity: z.string(), quantityMeasureKg: z.string(),
  unitPrice: z.string(), priceMeasureKg: z.string(),
});
const receiptValue = z.object({
  previousQuantityKg: z.string(), cumulativeQuantityKg: z.string(),
  previouslyRecognized: z.string(), unitPrice: z.string(), priceMeasureKg: z.string(),
});
const cashPayment = z.object({
  debtCurrency: currencySchema, afnCash: z.string(), pkrCash: z.string(),
  pkrPerAfn: z.string().optional(),
});
const roundingReduction = z.object({ previousReductions: z.string(), reduction: z.string(), outstandingBalance: z.string() });

export function normalizeMoney(value: unknown): string {
  return formatDecimal(parseNonNegativeDecimal(value, 2), 2);
}

export function calculateLineTotal(input: unknown): string {
  const line = pricedWeight.parse(input);
  const grams = parseNonNegativeDecimal(quantityToKg(line.quantity, line.quantityMeasureKg), 3);
  const price = parseNonNegativeDecimal(line.unitPrice, 2);
  return formatDecimal(roundHalfUp(grams * price, parseWeight(line.priceMeasureKg)), 2);
}

export function sumLineTotals(input: unknown): string {
  const lines = z.array(z.string()).max(1000).parse(input);
  return formatDecimal(lines.reduce((total, line) => total + parseNonNegativeDecimal(line, 2), BigInt(0)), 2);
}

export function calculateReceiptValue(input: unknown): string {
  const receipt = receiptValue.parse(input);
  const previous = parseNonNegativeDecimal(receipt.previousQuantityKg, 3);
  const cumulative = parseNonNegativeDecimal(receipt.cumulativeQuantityKg, 3);
  const recognized = parseNonNegativeDecimal(receipt.previouslyRecognized, 2);
  const price = parseNonNegativeDecimal(receipt.unitPrice, 2);
  const priceWeight = parseWeight(receipt.priceMeasureKg);
  if (cumulative < previous || recognized !== roundHalfUp(previous * price, priceWeight)) {
    throw new RangeError("Receipt quantities and previously recognized value must reconcile.");
  }
  const cumulativeValue = roundHalfUp(cumulative * price, priceWeight);
  // Bound cumulative state too, so the next receipt can parse its saved value.
  formatDecimal(cumulativeValue, 2);
  return formatDecimal(cumulativeValue - recognized, 2);
}

export function allocateCashPayment(input: unknown): string {
  const payment = cashPayment.parse(input);
  const afn = parseNonNegativeDecimal(payment.afnCash, 0);
  const pkr = parseNonNegativeDecimal(payment.pkrCash, 0);
  const rateScale = BigInt(1000000);
  const conversionNeeded = payment.debtCurrency === "AFN" ? pkr > BigInt(0) : afn > BigInt(0);
  if (conversionNeeded && payment.pkrPerAfn === undefined) throw new Error("A recorded PKR-per-AFN rate is required.");
  const rate = payment.pkrPerAfn === undefined ? rateScale : parseNonNegativeDecimal(payment.pkrPerAfn, 6);
  if (rate === BigInt(0)) throw new RangeError("The exchange rate must be positive.");
  const allocation = payment.debtCurrency === "AFN"
    ? roundHalfUp((afn * rate + pkr * rateScale) * BigInt(100), rate)
    : roundHalfUp((pkr * rateScale + afn * rate) * BigInt(100), rateScale);
  if (allocation === BigInt(0)) throw new RangeError("Cash must produce a positive allocation.");
  return formatDecimal(allocation, 2);
}

// Task 25 must authorize the owner and serialize this check with posting the reduction.
export function validateRoundingReduction(input: unknown): string {
  const entry = roundingReduction.parse(input);
  const previous = parseNonNegativeDecimal(entry.previousReductions, 2);
  const reduction = parseNonNegativeDecimal(entry.reduction, 2);
  const balance = parseNonNegativeDecimal(entry.outstandingBalance, 2);
  if (reduction === BigInt(0) || reduction > balance || previous + reduction > BigInt(99)) {
    throw new RangeError("A reduction must fit the balance and the lifetime 0.99 cap.");
  }
  return formatDecimal(reduction, 2);
}
