import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const inputClass = "min-h-11 w-full min-w-0 rounded-xl border border-input bg-surface px-3.5 py-2.5 text-base text-ink shadow-xs outline-none transition-[border-color,box-shadow] placeholder:text-ink-muted focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:bg-page disabled:opacity-60 read-only:bg-page aria-invalid:border-destructive aria-invalid:ring-destructive/20 sm:text-sm";

export function Input({ className, type, ...props }: ComponentProps<"input">) {
  return <input data-slot="input" type={type} className={cn(inputClass, className)} {...props} />;
}
