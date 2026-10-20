import type { Metadata } from "next";
import { requireSession } from "@/auth/server";
import { PlaceholderPage } from "../_components/placeholder-page";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  await requireSession();
  return (
    <PlaceholderPage
      title="Dashboard"
      description="Dashboard metrics will be introduced only after the underlying records and policies are available."
    />
  );
}
