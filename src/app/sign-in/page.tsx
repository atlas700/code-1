import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-page px-4 py-12 sm:px-6">
      <section className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <p className="text-sm font-semibold tracking-[0.16em] text-primary uppercase">
          Sign in
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
          Authentication is not ready yet.
        </h1>
        <p className="mt-4 leading-7 text-ink-muted">
          This intentional placeholder will be replaced when authentication is
          implemented in Task 6.
        </p>
        <Link
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-5 font-semibold text-ink transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          href="/"
        >
          Return to home
        </Link>
      </section>
    </main>
  );
}
