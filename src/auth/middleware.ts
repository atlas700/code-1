import { clerkMiddleware } from "@clerk/nextjs/server";
import { createNextMiddleware } from "gt-next/middleware";
import { env } from "@/env";

const localeMiddleware = createNextMiddleware({ localeRouting: false });

export const authMiddleware = clerkMiddleware(
  (_auth, request) => localeMiddleware(request),
  { signInUrl: "/sign-in", authorizedParties: [env.appOrigin] },
);
