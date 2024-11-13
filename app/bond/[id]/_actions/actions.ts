"use server";

import prisma from "@/db";
import { revalidatePath } from "next/cache";

export async function createPlan({
  name,
  position,
  cardId,
}: {
  name: string;
  position: number;
  cardId: string;
}) {
  try {
    if (!name.trim()) {
      return { success: false, error: "Please enter a plan" };
    }

    const cell = await prisma.bingoCell.upsert({
      where: {
        cardId_position: {
          cardId,
          position,
        },
      },
      create: {
        cardId,
        activity: name,
        position,
      },
      update: {
        activity: name,
      },
    });

    revalidatePath("/bond/" + cardId);
    return { success: true, data: cell };
  } catch (e) {
    const error = e as Error;
    console.error(error.message);
    return { success: false, error: "Failed to create a new bond" };
  }
}
