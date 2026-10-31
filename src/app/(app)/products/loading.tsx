import { T } from "gt-next";
import { LoadingState } from "@/components/feedback";

export default function ProductsLoading() {
  return <LoadingState><T>Loading products…</T></LoadingState>;
}
