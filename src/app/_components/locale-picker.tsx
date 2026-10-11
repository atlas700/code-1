import { LocaleSelector, T } from "gt-next";

export function LocalePicker() {
  return (
    <label className="flex min-h-11 items-center justify-between gap-4 text-sm font-medium text-ink">
      <span>
        <T>Language</T>
      </span>
      <LocaleSelector
        className="min-h-11 rounded-lg border border-border bg-surface px-3 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />
    </label>
  );
}
