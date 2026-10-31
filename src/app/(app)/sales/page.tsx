import type { Metadata } from "next";
import { T } from "gt-next";
import { requirePermission } from "@/db/authorization";
import { PlaceholderPage } from "../_components/placeholder-page";

export const metadata: Metadata = {
  title: "Sales",
};

export default async function SalesPage() {
  await requirePermission("organization.read");
  return (
    <PlaceholderPage
      title={<T>Sales</T>}
      description={<T>Sales are outside the current purchasing pilot.</T>}
    />
  );
}
