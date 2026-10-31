import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { T } from "gt-next";
import { SignIn } from "@/auth/components";
import { getSession } from "@/auth/server";
import { Brand } from "@/components/workspace";
import { LocalePicker } from "@/app/_components/locale-picker";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage() {
  if (await getSession()) redirect("/dashboard");

  return (
    <main className="grid min-h-dvh place-items-center bg-page px-4 py-12 sm:px-6">
      <section
        className="flex w-full max-w-md flex-col items-center gap-7"
        aria-labelledby="sign-in-heading"
      >
        <Link href="/" className="mb-2 inline-flex min-h-11 items-center"><Brand compact /></Link>
        <LocalePicker />
        <h1
          id="sign-in-heading"
          className="text-center text-2xl font-semibold tracking-tight text-ink"
        >
          <T>Sign in to your workspace</T>
        </h1>
        <SignIn withSignUp={false} transferable={false} />
        <Link
          className="inline-flex min-h-11 items-center rounded-xl px-4 text-sm text-ink-muted hover:text-primary"
          href="/"
        >
          <T>Return to home</T>
        </Link>
      </section>
    </main>
  );
}
