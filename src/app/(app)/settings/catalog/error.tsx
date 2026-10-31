"use client";

import { T } from "gt-next";
import { ErrorState } from "@/components/feedback";

export default function CatalogError({ retry }: { retry: () => void }) {
  return <ErrorState retry={retry}><T>Units and categories could not load. Please try again.</T></ErrorState>;
}
