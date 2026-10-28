import "server-only";
import { z } from "zod";

export const localIdSchema = z.uuid().brand<"LocalId">();
export type LocalId = z.infer<typeof localIdSchema>;

export const utcTimestampSchema = z.iso.datetime().max(24)
  .transform((value) => new Date(value).toISOString()).brand<"UtcTimestamp">();
export type UtcTimestamp = z.infer<typeof utcTimestampSchema>;

// Each workflow owns its explicit graph and its authorization/transaction preconditions.
export function assertStatusTransition(
  current: unknown,
  next: unknown,
  transitions: Readonly<Record<string, readonly string[]>>,
): void {
  if (typeof current !== "string" || typeof next !== "string" ||
      !Object.hasOwn(transitions, current) || !Object.hasOwn(transitions, next) ||
      !transitions[current].includes(next)) {
    throw new Error("This status transition is not allowed.");
  }
}
