import type { Metadata } from "next";
import { requirePermission } from "@/db/authorization";
import { PlaceholderPage } from "../_components/placeholder-page";

export const metadata: Metadata = {
  title: "Inventory",
};

export default async function InventoryPage() {
  await requirePermission("inventory.read");
  return (
    <PlaceholderPage
      title="Inventory"
      description="Inventory records and stock movements will be introduced in later inventory tasks."
    />
  );
}
