import type { Metadata } from "next";
import { requirePermission } from "@/db/authorization";
import { PlaceholderPage } from "../_components/placeholder-page";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  await requirePermission("organization.read");
  return (
    <PlaceholderPage
      title="Dashboard"
      description="Dashboard metrics will be introduced only after the underlying records and policies are available."
    />
  );
}
