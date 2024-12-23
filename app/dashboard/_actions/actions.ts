"use server";

import prisma from "@/db";
import { convertToTitleCase } from "@/lib/utils";
import { revalidatePath } from "next/cache";

interface CreateBondInput {
  name: string;
  description?: string;
  userId: string;
}

export async function createBond({
  name,
  description,
  userId,
}: CreateBondInput) {
  try {
    const titleCaseName = convertToTitleCase(name);

    const newRoom = await prisma.bond.create({
      data: {
        name: titleCaseName,
        description,
        createdById: userId,
      },
    });

    await prisma.member.create({
      data: {
        bondId: newRoom.id,
        userId: userId,
      },
    });

    await prisma.bingoCard.create({
      data: {
        bondId: newRoom.id,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: newRoom };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to create a new bond" };
  }
}
