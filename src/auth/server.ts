import "server-only";
import { auth } from "@clerk/nextjs/server";

export async function getSession() {
  const { isAuthenticated, userId } = await auth();
  return isAuthenticated ? { userId } : null;
}

export async function requireSession() {
  const { userId } = await auth.protect();
  return { userId };
}
