"use server";

import prisma from "@/db";
import { revalidatePath } from "next/cache";

export async function saveImageToDB({
  memoryId,
  url,
}: {
  memoryId: string;
  url: string;
}) {
  try {
    const memory = await prisma.memory.findUnique({
      where: {
        id: memoryId,
      },
    });

    if (!memory) {
      throw new Error("Memory not found");
    }

    await prisma.picture.create({
      data: {
        memoryId: memoryId,
        url: url,
      },
    });

    revalidatePath("/bond/" + memory.bondId + "/memories/" + memoryId);
    return { success: true };
  } catch (error) {
    console.error("Error saving images to DB:", error);
    throw new Error("Failed to save images to database");
  }
}
