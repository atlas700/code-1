import type { Metadata } from "next";
import { requireSession } from "@/auth/server";
import { PlaceholderPage } from "../_components/placeholder-page";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  await requireSession();
  return (
    <PlaceholderPage
      title="Settings"
      description="Organization settings will be available after authenticated organization onboarding is implemented."
    />
  );
}
