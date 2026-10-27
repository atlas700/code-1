"use client";

import { T } from "gt-next";

export default function StaffAccessError({ reset }: { reset: () => void }) {
  return <main className="mx-auto max-w-2xl space-y-4 px-4 py-12"><p role="alert"><T>Staff access could not load. Please try again.</T></p>
    <button type="button" onClick={reset} className="min-h-11 rounded-lg border border-border px-4 focus-visible:outline-2 focus-visible:outline-ring"><T>Try again</T></button></main>;
}
