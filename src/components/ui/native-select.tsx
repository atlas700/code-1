import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputClass } from "./input";

export function NativeSelect({ className, ...props }: ComponentProps<"select">) {
  return <div className="relative min-w-0" data-slot="native-select-wrapper">
    <select data-slot="native-select" className={cn(inputClass, "appearance-none pe-10", className)} {...props} />
    <ChevronDown aria-hidden="true" className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
  </div>;
}
