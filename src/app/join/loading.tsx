import { T } from "gt-next";
import { LoadingState } from "@/components/feedback";

export default function Loading() {
  return <div className="mx-auto max-w-2xl p-8"><LoadingState><T>Loading staff access…</T></LoadingState></div>;
}
