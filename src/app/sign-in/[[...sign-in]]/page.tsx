import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { T } from "gt-next";
import { SignIn } from "@/auth/components";
import { getSession } from "@/auth/server";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage() {
  if (await getSession()) redirect("/dashboard");

  return (
    <main className="grid min-h-screen place-items-center bg-page px-4 py-12 sm:px-6">
      <section
        className="flex w-full max-w-md flex-col items-center gap-6"
        aria-labelledby="sign-in-heading"
      >
        <h1
          id="sign-in-heading"
          className="text-3xl font-semibold tracking-tight text-ink"
        >
          <T>Sign in to your workspace</T>
        </h1>
        <SignIn withSignUp={false} transferable={false} />
        <Link
          className="inline-flex min-h-11 items-center rounded-lg px-4 font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          href="/"
        >
          <T>Return to home</T>
        </Link>
      </section>
    </main>
  );
}
