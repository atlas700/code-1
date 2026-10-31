"use client";

import { T } from "gt-next";
import { ErrorState } from "@/components/feedback";

export default function StaffError({ reset }: { reset: () => void }) {
  return <ErrorState reset={reset}><T>Staff could not load. Please try again.</T></ErrorState>;
}
