"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { requireSession } from "@/auth/server";
import { manageCatalog, type CatalogState } from "@/db/catalog";

export async function updateCatalog(_previous: CatalogState, formData: FormData): Promise<CatalogState> {
  let stage = "authentication";
  try {
    await requireSession();
    stage = "catalogue-mutation";
    const result = await manageCatalog(formData instanceof FormData ? {
      operation: formData.get("operation"), id: formData.get("id"), name: formData.get("name"),
      unit: { kind: formData.get("kind"), kilogramsPerUnit: formData.get("kind") === "bag" ? null : formData.get("kilogramsPerUnit") },
    } : null);
    if (result.status === "success") {
      stage = "refresh";
      revalidatePath("/settings/catalog");
    }
    return result;
  } catch (error) {
    unstable_rethrow(error);
    const correlationId = randomUUID();
    console.error({ event: "catalogue_management_failed", stage, correlationId });
    return { status: "error", correlationId };
  }
}
