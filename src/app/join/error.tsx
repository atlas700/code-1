"use client";

import { T } from "gt-next";
import { ErrorState } from "@/components/feedback";

export default function StaffAccessError({ reset }: { reset: () => void }) {
  return <main className="mx-auto max-w-2xl px-4 py-12"><ErrorState reset={reset}><T>Staff access could not load. Please try again.</T></ErrorState></main>;
}
