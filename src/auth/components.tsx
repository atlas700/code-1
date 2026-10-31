import { SignOutButton } from "@clerk/nextjs";
import { T } from "gt-next";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export { ClerkProvider as AuthProvider, SignIn } from "@clerk/nextjs";

export function SignOut() {
  return (
    <SignOutButton redirectUrl="/">
      <Button
        type="button"
        variant="ghost"
      >
        <LogOut aria-hidden="true" />
        <T>Sign out</T>
      </Button>
    </SignOutButton>
  );
}
