import type { Metadata } from "next";
import { PlaceholderPage } from "../_components/placeholder-page";

export const metadata: Metadata = {
  title: "Payments",
};

export default function PaymentsPage() {
  return (
    <PlaceholderPage
      title="Payments"
      description="Payment recording will be added only after invoices, payables, and allocation policies are in place."
    />
  );
}
