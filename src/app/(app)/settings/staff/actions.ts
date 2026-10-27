"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { requireSession } from "@/auth/server";
import { manageStaff, type StaffState } from "@/db/staff";

export async function updateStaff(_previous: StaffState, formData: FormData): Promise<StaffState> {
  let stage = "authentication";
  try {
    await requireSession();
    stage = "staff-mutation";
    const result = await manageStaff(formData instanceof FormData ? {
      operation: formData.get("operation"), emailAddress: formData.get("emailAddress"),
      userId: formData.get("userId"), membershipId: formData.get("membershipId"),
      role: formData.get("role"), invitationId: formData.get("invitationId"),
    } : null);
    if (result.status === "success") {
      stage = "refresh";
      revalidatePath("/settings/staff");
    }
    return result;
  } catch (error) {
    unstable_rethrow(error);
    const correlationId = randomUUID();
    console.error({ event: "staff_management_failed", stage, correlationId });
    return { status: "error", correlationId };
  }
}
