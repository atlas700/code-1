import type { Metadata } from "next";
import { PlaceholderPage } from "../_components/placeholder-page";

export const metadata: Metadata = {
  title: "Purchases",
};

export default function PurchasesPage() {
  return (
    <PlaceholderPage
      title="Purchases"
      description="Purchasing workflows will be added after supplier and product foundations exist."
    />
  );
}
