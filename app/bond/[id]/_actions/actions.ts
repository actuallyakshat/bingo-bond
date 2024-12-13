"use server";

import prisma from "@/db";
import { revalidatePath } from "next/cache";

export async function createActivity({
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

export async function deleteActivity({
  cardId,
  position,
}: {
  cardId: string;
  position: number;
}) {
  try {
    const cell = await prisma.bingoCell.delete({
      where: {
        cardId_position: {
          cardId,
          position,
        },
      },
    });

    revalidatePath("/bond/" + cardId);
    return { success: true, data: cell };
  } catch (e) {
    const error = e as Error;
    console.error(error.message);
    return { success: false, error: "Failed to delete a plan" };
  }
}

export async function addMember({
  bondId,
  email,
}: {
  bondId: string;
  email: string;
}) {
  try {
    if (!bondId || !email) {
      return {
        success: false,
        error: "Bond ID and email are required",
      };
    }

    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) return { success: false, error: "User not found" };

    const bond = await prisma.bond.findUnique({
      where: {
        id: bondId,
      },
      include: {
        members: true,
      },
    });

    if (!bond) return { success: false, error: "Bond not found" };
    if (bond.members.some((member) => member.userId == user.id))
      return { success: false, error: "User is already a member" };

    const userId = user.id;

    const invite = await prisma.invite.create({
      data: {
        bondId,
        userId,
      },
    });

    return { success: true, data: invite };
  } catch (e) {
    const error = e as Error;
    console.error(error.message);
    return { success: false, error: "Failed to create an invite" };
  }
}

export async function deletePlan({ bondId }: { bondId: string }) {
  try {
    const cell = await prisma.bond.delete({
      where: {
        id: bondId,
      },
    });

    revalidatePath("/bond/" + bondId);
    return { success: true, data: cell };
  } catch (e) {
    const error = e as Error;
    console.error(error.message);
    return { success: false, error: "Failed to delete a plan" };
  }
}

export async function acceptInvite({ inviteId }: { inviteId: string }) {
  try {
    const invite = await prisma.invite.findUnique({
      where: {
        id: inviteId,
      },
    });

    if (!invite) return { success: false, error: "Invite not found" };

    const bond = await prisma.bond.findUnique({
      where: {
        id: invite.bondId,
      },
      include: {
        members: true,
      },
    });

    if (!bond) return { success: false, error: "Bond not found" };

    const user = await prisma.user.findUnique({
      where: {
        id: invite.userId,
      },
    });

    if (!user) return { success: false, error: "User not found" };

    if (bond.members.some((member) => member.userId == user.id))
      return { success: false, error: "User is already a member" };

    const member = await prisma.member.create({
      data: {
        bondId: bond.id,
        userId: user.id,
      },
    });

    await prisma.invite.delete({
      where: {
        id: inviteId,
      },
    });

    revalidatePath("/dashboard/invites");
    return { success: true, data: member };
  } catch (e) {
    const error = e as Error;
    console.error(error.message);
    return { success: false, error: "Failed to accept the invite" };
  }
}

export async function rejectInvite({ inviteId }: { inviteId: string }) {
  try {
    const invite = await prisma.invite.findUnique({
      where: {
        id: inviteId,
      },
    });

    if (!invite) return { success: false, error: "Invite not found" };

    await prisma.invite.delete({
      where: {
        id: inviteId,
      },
    });

    revalidatePath("/dashboard/invites");
    return { success: true, data: invite };
  } catch (e) {
    const error = e as Error;
    console.error(error.message);
    return { success: false, error: "Failed to reject the invite" };
  }
}

export async function deleteMember({
  bondId,
  userId,
}: {
  bondId: string;
  userId: string;
}) {
  try {
    if (!bondId || !userId) {
      return {
        success: false,
        error: "Bond ID and User ID are required",
      };
    }

    const bond = await prisma.bond.findUnique({
      where: { id: bondId },
      include: { members: true },
    });

    if (!bond) {
      return { success: false, error: "Bond not found" };
    }

    const isMember = bond.members.some((member) => member.userId === userId);

    if (!isMember) {
      return { success: false, error: "User is not a member of this bond" };
    }

    const deletedMember = await prisma.member.delete({
      where: {
        bondId_userId: {
          bondId,
          userId,
        },
      },
    });

    revalidatePath(`/bond/${bondId}`);

    return { success: true, data: deletedMember };
  } catch (e) {
    const error = e as Error;
    console.error(error.message);
    return { success: false, error: "Failed to remove member from the bond" };
  }
}

export async function updateBondName({
  bondId,
  name,
}: {
  bondId: string;
  name: string;
}) {
  try {
    if (!bondId || !name) {
      return {
        success: false,
        error: "Bond ID and name are required",
      };
    }

    const bond = await prisma.bond.update({
      where: {
        id: bondId,
      },
      data: {
        name,
      },
    });

    revalidatePath(`/bond/${bondId}`);

    return { success: true, data: bond };
  } catch (e) {
    const error = e as Error;
    console.error(error.message);
    return { success: false, error: "Failed to update the bond name" };
  }
}
