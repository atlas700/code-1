import type { Metadata } from "next";
import { T } from "gt-next";
import { requirePermission } from "@/db/authorization";
import { PlaceholderPage } from "../_components/placeholder-page";

export const metadata: Metadata = {
  title: "Payments",
};

export default async function PaymentsPage() {
  await requirePermission("supplier_payments.read");
  return (
    <PlaceholderPage
      title={<T>Payments</T>}
      description={<T>Supplier payments and statements are not available yet.</T>}
    />
  );
}
