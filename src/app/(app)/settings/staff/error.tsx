"use client";

import { T } from "gt-next";

export default function StaffError({ reset }: { reset: () => void }) {
  return <div className="space-y-4"><p role="alert"><T>Staff could not load. Please try again.</T></p>
    <button type="button" onClick={reset} className="min-h-11 rounded-lg border border-border px-4 focus-visible:outline-2 focus-visible:outline-ring"><T>Try again</T></button></div>;
}
