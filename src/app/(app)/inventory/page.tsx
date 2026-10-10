import type { Metadata } from "next";
import { PlaceholderPage } from "../_components/placeholder-page";

export const metadata: Metadata = {
  title: "Inventory",
};

export default function InventoryPage() {
  return (
    <PlaceholderPage
      title="Inventory"
      description="Inventory records and stock movements will be introduced in later inventory tasks."
    />
  );
}
