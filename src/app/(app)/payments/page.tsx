import type { Metadata } from "next";
import { requirePermission } from "@/db/authorization";
import { PlaceholderPage } from "../_components/placeholder-page";

export const metadata: Metadata = {
  title: "Payments",
};

export default async function PaymentsPage() {
  await requirePermission("supplier_payments.read");
  return (
    <PlaceholderPage
      title="Payments"
      description="Payment recording will be added only after invoices, payables, and allocation policies are in place."
    />
  );
}
