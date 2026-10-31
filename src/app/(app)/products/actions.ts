"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { requireSession } from "@/auth/server";
import { manageCatalog, type CatalogState } from "@/db/catalog";

export async function updateProduct(_previous: CatalogState, formData: FormData): Promise<CatalogState> {
  let stage = "authentication";
  try {
    await requireSession();
    stage = "product-mutation";
    const operation = formData instanceof FormData ? formData.get("operation") : null;
    const result = await manageCatalog(operation === "create-product" || operation === "update-product" || operation === "deactivate-product" ? {
      operation, id: formData.get("id"), name: formData.get("name"), sku: formData.get("sku"),
      unitId: formData.get("unitId"), categoryId: formData.get("categoryId") === "" ? null : formData.get("categoryId"),
    } : null);
    if (result.status === "success") {
      stage = "refresh";
      revalidatePath("/products");
      revalidatePath("/products/[id]", "page");
    }
    return result;
  } catch (error) {
    unstable_rethrow(error);
    const correlationId = randomUUID();
    console.error({ event: "product_management_failed", stage, correlationId });
    return { status: "error", correlationId };
  }
}
