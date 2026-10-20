import { SignOutButton } from "@clerk/nextjs";
import { T } from "gt-next";

export { ClerkProvider as AuthProvider, SignIn } from "@clerk/nextjs";

export function SignOut() {
  return (
    <SignOutButton redirectUrl="/">
      <button
        type="button"
        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-4 font-semibold text-ink transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <T>Sign out</T>
      </button>
    </SignOutButton>
  );
}
