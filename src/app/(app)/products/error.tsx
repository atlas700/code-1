"use client";

import { T } from "gt-next";
import { ErrorState } from "@/components/feedback";

export default function ProductsError({ retry }: { retry: () => void }) {
  return <ErrorState retry={retry}><T>Products could not load. Please try again.</T></ErrorState>;
}
