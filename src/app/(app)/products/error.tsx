"use client";

import { T } from "gt-next";
import { ErrorState } from "@/components/feedback";

export default function ProductsError({ reset }: { reset: () => void }) {
  return <ErrorState reset={reset}><T>Products could not load. Please try again.</T></ErrorState>;
}
