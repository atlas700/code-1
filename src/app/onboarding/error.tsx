"use client";

import { T } from "gt-next";

export default function OnboardingError({ reset }: { reset: () => void }) {
  return (
    <main className="grid min-h-dvh place-items-center bg-page p-6">
      <section className="w-full max-w-xl rounded-2xl border border-border bg-surface p-8">
        <h1 className="text-2xl font-semibold"><T>Business setup is unavailable</T></h1>
        <p className="mt-4 leading-7 text-ink-muted"><T>Your saved setup has been kept. Please try again.</T></p>
        <button type="button" onClick={reset} className="mt-6 min-h-11 rounded-lg bg-primary px-5 font-semibold text-on-primary hover:bg-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"><T>Try again</T></button>
      </section>
    </main>
  );
}
