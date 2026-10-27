import type { Metadata } from "next";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { T } from "gt-next";
import { getLocale } from "gt-next/server";
import { SignOut } from "@/auth/components";
import { requireSession } from "@/auth/server";
import { getOnboardingRequest } from "@/db/onboarding";
import { LocalePicker } from "../_components/locale-picker";
import { OnboardingForm } from "./_components/onboarding-form";
import { logOnboardingFailure } from "./_lib/failure";

export const metadata: Metadata = { title: "Set up your business" };

export default async function OnboardingPage() {
  const { userId } = await requireSession();
  const locale = await getLocale();
  let request;
  try {
    request = await getOnboardingRequest(userId);
  } catch (error) {
    unstable_rethrow(error);
    const correlationId = logOnboardingFailure("load-saved-setup");
    throw new Error(`Business setup unavailable. Reference: ${correlationId}`);
  }
  const initialValues = request ? {
    name: request.name,
    businessType: request.businessType,
    timezone: request.timezone,
    baseCurrency: request.baseCurrency,
    locale: request.locale,
  } : { name: "", businessType: "", timezone: "", baseCurrency: "AFN", locale };

  return (
    <main className="min-h-dvh bg-page px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-primary"><T>Agricultural Supply Chain</T></p>
          <SignOut />
        </header>
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8" aria-labelledby="onboarding-title">
          <h1 id="onboarding-title" className="text-3xl font-semibold tracking-tight text-ink"><T>Set up your business</T></h1>
          <p className="mt-3 mb-7 leading-7 text-ink-muted"><T>Create your business workspace. If setup is interrupted, return here to continue with the same details.</T></p>
          <Link href="/join" prefetch={false} className="mb-6 inline-flex min-h-11 items-center text-primary underline focus-visible:outline-2 focus-visible:outline-ring"><T>Joining an existing business? Open staff access.</T></Link>
          <OnboardingForm initialValues={initialValues} resuming={request !== null} />
          <div className="mt-7 border-t border-border pt-5"><LocalePicker /></div>
        </section>
      </div>
    </main>
  );
}
