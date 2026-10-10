import type { Metadata } from "next";
import { PlaceholderPage } from "../_components/placeholder-page";

export const metadata: Metadata = {
  title: "Sales",
};

export default function SalesPage() {
  return (
    <PlaceholderPage
      title="Sales"
      description="Sales workflows will be added after customer, product, and inventory foundations exist."
    />
  );
}
