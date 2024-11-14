"use server";

import prisma from "@/db";

export async function updateUser({
  userId,
  name,
  emailPreferences,
}: {
  userId: string;
  name: string;
  emailPreferences: boolean;
}) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) return { success: false, error: "User not found" };

    const res = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        emailPreferences,
      },
    });

    return { success: true, data: res };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to update user" };
  }
}
