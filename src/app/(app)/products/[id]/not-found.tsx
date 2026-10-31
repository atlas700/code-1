import Link from "next/link";
import { T } from "gt-next";
import { Panel } from "@/components/workspace";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return <Panel className="space-y-5"><h1 className="text-xl font-semibold"><T>Product unavailable</T></h1>
    <Button asChild variant="outline"><Link href="/products"><T>Back to products</T></Link></Button></Panel>;
}
