"use client";

import { T } from "gt-next";
import { Button } from "@/components/ui/button";

export default function OnboardingError({ reset }: { reset: () => void }) {
  return (
    <main className="grid min-h-dvh place-items-center bg-page p-6">
      <section className="w-full max-w-xl rounded-2xl border border-border bg-surface p-8">
        <h1 className="text-2xl font-semibold"><T>Business setup is unavailable</T></h1>
        <p className="mt-4 leading-7 text-ink-muted"><T>Your saved setup has been kept. Please try again.</T></p>
        <Button type="button" onClick={reset} className="mt-6"><T>Try again</T></Button>
      </section>
    </main>
  );
}
