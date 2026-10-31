import { LocaleSelector, T } from "gt-next";
import { Globe2 } from "lucide-react";

export function LocalePicker() {
  return (
    <label className="flex min-h-11 items-center gap-2 text-sm text-ink-muted">
      <Globe2 className="size-4 shrink-0" aria-hidden="true" />
      <span className="sr-only">
        <T>Language</T>
      </span>
      <LocaleSelector
        className="min-h-11 max-w-36 rounded-xl bg-transparent px-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />
    </label>
  );
}
