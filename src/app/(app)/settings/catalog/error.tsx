"use client";

import { T } from "gt-next";
import { ErrorState } from "@/components/feedback";

export default function CatalogError({ reset }: { reset: () => void }) {
  return <ErrorState reset={reset}><T>Units and categories could not load. Please try again.</T></ErrorState>;
}
