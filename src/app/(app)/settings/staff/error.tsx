"use client";

import { T } from "gt-next";
import { ErrorState } from "@/components/feedback";

export default function StaffError({ retry }: { retry: () => void }) {
  return <ErrorState retry={retry}><T>Staff could not load. Please try again.</T></ErrorState>;
}
