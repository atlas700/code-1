import "server-only";

const nodeEnvironments = ["development", "production", "test"] as const;

type NodeEnvironment = (typeof nodeEnvironments)[number];

function isNodeEnvironment(value: string | undefined): value is NodeEnvironment {
  return nodeEnvironments.some((environment) => environment === value);
}

export function validateServerEnvironment(
  environment: Readonly<Record<string, string | undefined>> = process.env,
) {
  const nodeEnvironment = environment.NODE_ENV;
  if (!isNodeEnvironment(nodeEnvironment)) {
    throw new Error(
      "Invalid NODE_ENV. Set it to development, production, or test before starting the application.",
    );
  }

  const clerkPublishableKey = environment.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const clerkSecretKey = environment.CLERK_SECRET_KEY;

  if (
    !clerkPublishableKey ||
    !/^pk_(test|live)_[A-Za-z0-9+/=]+$/.test(clerkPublishableKey)
  ) {
    throw new Error(
      "Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to your Clerk publishable key in .env.local or the deployment environment.",
    );
  }

  if (!clerkSecretKey || !/^sk_(test|live)_[A-Za-z0-9_-]+$/.test(clerkSecretKey)) {
    throw new Error(
      "Set CLERK_SECRET_KEY to your Clerk secret key in .env.local or the deployment environment. Never expose it with NEXT_PUBLIC_.",
    );
  }

  const isLive = clerkPublishableKey.startsWith("pk_live_");
  if (isLive !== clerkSecretKey.startsWith("sk_live_")) {
    throw new Error(
      "Clerk publishable and secret keys must both be test keys or both be live keys.",
    );
  }

  const appOrigin = environment.APP_ORIGIN ?? "http://localhost:3000";
  let url: URL;
  try {
    url = new URL(appOrigin);
  } catch {
    throw new Error(
      "Set APP_ORIGIN to the application's exact origin, for example http://localhost:3000.",
    );
  }
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.origin !== appOrigin ||
    (isLive && url.protocol !== "https:")
  ) {
    throw new Error(
      "APP_ORIGIN must be an HTTP(S) origin without a path or trailing slash. Live Clerk instances require HTTPS.",
    );
  }

  return { nodeEnvironment, clerkPublishableKey, clerkSecretKey, appOrigin } as const;
}

export const env = validateServerEnvironment();
