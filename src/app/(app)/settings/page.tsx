import type { Metadata } from "next";
import { PlaceholderPage } from "../_components/placeholder-page";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <PlaceholderPage
      title="Settings"
      description="Organization settings will be available after authenticated organization onboarding is implemented."
    />
  );
}
