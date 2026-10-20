import type { Metadata } from "next";
import { requireSession } from "@/auth/server";
import { PlaceholderPage } from "../_components/placeholder-page";

export const metadata: Metadata = {
  title: "Payments",
};

export default async function PaymentsPage() {
  await requireSession();
  return (
    <PlaceholderPage
      title="Payments"
      description="Payment recording will be added only after invoices, payables, and allocation policies are in place."
    />
  );
}
