import Link from "next/link";
import { T } from "gt-next";

export default function ProductNotFound() {
  return <div className="space-y-4"><h1 className="text-2xl font-semibold"><T>Product unavailable</T></h1>
    <Link href="/products" className="text-primary underline focus-visible:outline-2 focus-visible:outline-ring"><T>Back to products</T></Link></div>;
}
