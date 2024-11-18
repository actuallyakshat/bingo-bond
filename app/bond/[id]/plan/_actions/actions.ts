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

export async function deletePlan({
  bondId,
  planId,
}: {
  bondId: string;
  planId: string;
}) {
  try {
    const plan = await prisma.plan.delete({
      where: {
        id: planId,
      },
    });

    revalidatePath("/bond/" + bondId + "/plan");
    return { success: true, data: plan };
  } catch (e) {
    const error = e as Error;
    console.error(error.message);
    return { success: false, error: "Failed to delete a plan" };
  }
}

export async function createMemory({
  planId,
  bondId,
  memoryDate,
}: {
  planId: string;
  bondId: string;
  memoryDate: Date;
}) {
  try {
    const plan = await prisma.plan.findUnique({
      where: {
        id: planId,
      },
      include: {
        cell: {
          select: {
            activity: true,
          },
        },
      },
    });

    if (!plan) throw new Error("Plan not found");

    const newMemory = await prisma.memory.create({
      data: {
        bondId: bondId,
        memoryDate: memoryDate,
        name: plan.cell.activity,
        description: plan.planDescription,
        date: plan.planDate,
      },
    });

    await prisma.plan.update({
      where: {
        id: planId,
      },
      data: {
        memoryId: newMemory.id,
        completed: true,
      },
    });

    revalidatePath("/bond/" + bondId + "/plan");
    revalidatePath("/bond/" + bondId + "/memories");
    return { success: true, data: newMemory };
  } catch (e) {
    const error = e as Error;
    console.error(error.message);
    return { success: false, error: "Failed to create a new memory" };
  }
}
