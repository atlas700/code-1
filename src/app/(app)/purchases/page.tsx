import type { Metadata } from "next";
import { T } from "gt-next";
import { requirePermission } from "@/db/authorization";
import { PlaceholderPage } from "../_components/placeholder-page";

export const metadata: Metadata = {
  title: "Purchases",
};

export default async function PurchasesPage() {
  await requirePermission("purchases.read");
  return (
    <PlaceholderPage
      title={<T>Purchases</T>}
      description={<T>Purchase and receipt recording is not available yet. You can organize your products in the meantime.</T>}
    />
  );
}
