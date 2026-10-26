import type { Metadata } from "next";
import { requirePermission } from "@/db/authorization";
import { PlaceholderPage } from "../_components/placeholder-page";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  await requirePermission("organization.read");
  return (
    <PlaceholderPage
      title="Settings"
      description="Organization settings will be available after authenticated organization onboarding is implemented."
    />
  );
}
