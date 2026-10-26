import type { Metadata } from "next";
import { requirePermission } from "@/db/authorization";
import { PlaceholderPage } from "../_components/placeholder-page";

export const metadata: Metadata = {
  title: "Sales",
};

export default async function SalesPage() {
  await requirePermission("organization.read");
  return (
    <PlaceholderPage
      title="Sales"
      description="Sales workflows will be added after customer, product, and inventory foundations exist."
    />
  );
}
