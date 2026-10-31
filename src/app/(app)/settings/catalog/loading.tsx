import { T } from "gt-next";
import { LoadingState } from "@/components/feedback";

export default function CatalogLoading() {
  return <LoadingState><T>Loading units and categories…</T></LoadingState>;
}
