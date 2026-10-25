// Drizzle Kit runs outside Next.js, so this validator must not import server-only.
export function validateDatabaseUrl(value: string | undefined): string {
  try {
    if (!value) throw new Error();
    const url = new URL(value);
    if (
      !["postgres:", "postgresql:"].includes(url.protocol) ||
      !url.hostname ||
      !url.username ||
      url.pathname.length <= 1 ||
      url.hash
    ) {
      throw new Error();
    }
    decodeURIComponent(url.username);
    decodeURIComponent(url.password);
    decodeURIComponent(url.pathname);
    return value;
  } catch {
    throw new Error(
      "Set DATABASE_URL to a PostgreSQL connection URL with a host, user, and database in .env.local or the deployment environment. Never expose it with NEXT_PUBLIC_.",
    );
  }
}
