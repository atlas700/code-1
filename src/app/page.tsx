import Link from "next/link";

export default function Home() {
  return (
    <main className="grid min-h-screen place-items-center bg-page px-4 py-12 sm:px-6">
      <section className="w-full max-w-xl rounded-2xl border border-border bg-surface p-8 shadow-sm sm:p-12">
        <p className="text-sm font-semibold tracking-[0.16em] text-primary uppercase">
          Afghanistan Agricultural Supply Chain OS
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          A clearer way to run your trading day.
        </h1>
        <p className="mt-5 max-w-lg text-base leading-7 text-ink-muted">
          Manage buying, receiving, selling, and payments from one workspace.
          Authentication will be introduced in Task 6.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 font-semibold text-on-primary transition-colors hover:bg-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            href="/sign-in"
          >
            Go to sign-in placeholder
          </Link>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-5 font-semibold text-ink transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            href="/dashboard"
          >
            View app shell
          </Link>
        </div>
      </section>
    </main>
  );
}
