import type { Metadata } from "next";
import { requirePermission } from "@/db/authorization";
import { PlaceholderPage } from "../_components/placeholder-page";

export const metadata: Metadata = {
  title: "Purchases",
};

export default async function PurchasesPage() {
  await requirePermission("purchases.read");
  return (
    <PlaceholderPage
      title="Purchases"
      description="Purchasing workflows will be added after supplier and product foundations exist."
    />
  );
}
