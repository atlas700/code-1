import Link from "next/link";
import { T } from "gt-next";
import { Brand, PageHeader, Panel } from "@/components/workspace";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return <main className="mx-auto min-h-dvh max-w-2xl space-y-7 px-4 py-10 sm:px-6">
    <Brand />
    <Panel className="space-y-6">
      <PageHeader title={<T>Page unavailable</T>} description={<T>This page is unavailable. Return to your workspace to continue.</T>} />
      <Button asChild><Link href="/dashboard" prefetch={false}><T>Open workspace</T></Link></Button>
    </Panel>
  </main>;
}
