import Link from "next/link";
import type { ReactNode } from "react";
import { T } from "gt-next";
import { Inbox, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel } from "@/components/workspace";

type PlaceholderPageProps = {
  title: ReactNode;
  description: ReactNode;
};

export function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <div className="space-y-8">
      <PageHeader title={title} />
      <Panel className="flex min-h-80 flex-col items-center justify-center py-14 text-center sm:py-20">
        <span className="mb-5 grid size-16 place-items-center rounded-2xl bg-page text-ink-muted"><Inbox className="size-7" aria-hidden="true" /></span>
        <p className="text-lg font-semibold"><T>Not available yet</T></p>
        <p className="mt-3 max-w-md text-sm leading-7 text-ink-muted">{description}</p>
        <Button asChild variant="outline" className="mt-7"><Link href="/dashboard"><ArrowLeft aria-hidden="true" className="rtl:-scale-x-100" /><T>Back to overview</T></Link></Button>
      </Panel>
    </div>
  );
}
