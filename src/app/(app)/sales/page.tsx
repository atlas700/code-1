import type { Metadata } from "next";
import { requireSession } from "@/auth/server";
import { PlaceholderPage } from "../_components/placeholder-page";

export const metadata: Metadata = {
  title: "Sales",
};

export default async function SalesPage() {
  await requireSession();
  return (
    <PlaceholderPage
      title="Sales"
      description="Sales workflows will be added after customer, product, and inventory foundations exist."
    />
  );
}
