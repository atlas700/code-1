import type { Metadata } from "next";
import { T } from "gt-next";
import { requirePermission } from "@/db/authorization";
import { PlaceholderPage } from "../_components/placeholder-page";

export const metadata: Metadata = {
  title: "Inventory",
};

export default async function InventoryPage() {
  await requirePermission("inventory.read");
  return (
    <PlaceholderPage
      title={<T>Inventory</T>}
      description={<T>Stock balances will appear here once receiving is available.</T>}
    />
  );
}
