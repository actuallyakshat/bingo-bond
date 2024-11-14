"use server";

import prisma from "@/db";
import { revalidatePath } from "next/cache";

export async function createPlan({
  cellId,
  cardId,
  planDate,
  planDescription,
}: {
  cellId: string;
  cardId: string;
  planDate: Date;
  planDescription: string;
}) {
  try {
    if (!cellId || !cardId || !planDate || !planDescription) {
      return {
        success: false,
        error: "Please enter a plan",
      };
    }

    const cell = await prisma.bingoCell.findUnique({
      where: {
        id: cellId,
      },
    });

    if (!cell) return { success: false, error: "Cell not found" };

    const card = await prisma.bingoCard.findUnique({
      where: {
        id: cardId,
      },
    });

    if (!card) return { success: false, error: "Card not found" };

    const plan = await prisma.plan.create({
      data: {
        cellId: cellId,
        cardId: cardId,
        planDate: planDate,
        planDescription: planDescription,
      },
    });

    revalidatePath("/bond/" + cardId + "/plan");
    return { success: true, data: plan };
  } catch (e) {
    const error = e as Error;
    console.error(error.message);
    return { success: false, error: "Failed to create a new plan" };
  }
}
