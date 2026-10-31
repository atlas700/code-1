import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Field({ className, ...props }: ComponentProps<"div">) {
  return <div role="group" data-slot="field" className={cn("flex min-w-0 flex-col gap-2.5 data-[invalid=true]:text-destructive", className)} {...props} />;
}

export function FieldLabel({ className, ...props }: ComponentProps<"label">) {
  return <label data-slot="field-label" className={cn("text-sm font-medium leading-snug", className)} {...props} />;
}

export function FieldDescription({ className, ...props }: ComponentProps<"p">) {
  return <p data-slot="field-description" className={cn("text-sm leading-6 text-ink-muted", className)} {...props} />;
}

export function FieldError({ className, ...props }: ComponentProps<"p">) {
  return <p role="alert" data-slot="field-error" className={cn("text-sm leading-6 text-destructive", className)} {...props} />;
}
