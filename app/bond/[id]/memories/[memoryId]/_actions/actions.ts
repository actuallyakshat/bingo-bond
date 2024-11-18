"use server";

import prisma from "@/db";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface SaveImageParams {
  memoryId: string;
  url: string;
}

interface DeleteMemoryParams {
  memoryId: string;
}

interface DeleteImageParams {
  pictureId: string;
}

async function deleteFromCloudinary(url: string) {
  try {
    console.log("Starting Cloudinary deletion for URL:", url);

    const urlParts = url.split("/");
    console.log("URL parts:", urlParts);

    const uploadIndex = urlParts.indexOf("upload");
    if (uploadIndex === -1) {
      throw new Error("Invalid Cloudinary URL format");
    }

    const relevantParts = urlParts.slice(uploadIndex + 2);
    console.log("Relevant parts after upload:", relevantParts);

    const lastPart = relevantParts[relevantParts.length - 1];
    const nameWithoutExtension = lastPart.split(".")[0];
    relevantParts[relevantParts.length - 1] = nameWithoutExtension;

    const publicId = relevantParts.join("/");
    console.log("Extracted public_id with folder:", publicId);

    if (!publicId) {
      console.error("Could not extract public_id from URL:", url);
      throw new Error("Invalid Cloudinary URL");
    }

    console.log(
      "Attempting to delete from Cloudinary with public_id:",
      publicId
    );
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary deletion result:", result);

    return result;
  } catch (error) {
    console.error("Error details in deleteFromCloudinary:", {
      error,
      stack: error instanceof Error ? error.stack : undefined,
      url: url,
    });
    throw new Error("Failed to delete image from Cloudinary");
  }
}

export async function saveImageToDB({ memoryId, url }: SaveImageParams) {
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

export async function deleteMemory({ memoryId }: DeleteMemoryParams) {
  try {
    console.log("Starting memory deletion process for memoryId:", memoryId);

    const memory = await prisma.memory.findUnique({
      where: {
        id: memoryId,
      },
      include: {
        plan: {
          select: {
            id: true,
          },
        },
        pictures: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });

    if (!memory) {
      console.error("Memory not found:", memoryId);
      throw new Error("Memory not found");
    }

    console.log("Found memory with pictures:", memory.pictures);
    const planId = memory.plan?.id;

    // Delete all associated pictures from Cloudinary
    if (memory.pictures && memory.pictures.length > 0) {
      console.log(
        "Starting deletion of",
        memory.pictures.length,
        "pictures from Cloudinary"
      );
      const deletionResults = await Promise.all(
        memory.pictures.map(async (picture) => {
          console.log("Attempting to delete picture:", picture);
          try {
            return await deleteFromCloudinary(picture.url);
          } catch (error) {
            console.error("Failed to delete individual picture:", {
              pictureId: picture.id,
              url: picture.url,
              error,
            });
            return null;
          }
        })
      );
      console.log("Cloudinary deletion results:", deletionResults);
    }

    console.log("Deleting memory from database:", memoryId);
    await prisma.memory.delete({
      where: {
        id: memoryId,
      },
    });

    if (planId) {
      console.log("Updating plan status for planId:", planId);
      await prisma.plan.update({
        where: {
          id: planId,
        },
        data: {
          completed: false,
        },
      });
    }

    revalidatePath("/bond/" + memory.bondId + "/memories");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteMemory:", {
      error,
      stack: error instanceof Error ? error.stack : undefined,
      memoryId,
    });
    throw new Error("Failed to delete memory");
  }
}

export async function deleteImage({ pictureId }: DeleteImageParams) {
  try {
    console.log("Starting image deletion process for pictureId:", pictureId);

    const picture = await prisma.picture.findUnique({
      where: {
        id: pictureId,
      },
      include: {
        memory: {
          select: {
            bondId: true,
          },
        },
      },
    });

    if (!picture) {
      console.error("Picture not found:", pictureId);
      throw new Error("Picture not found");
    }

    console.log("Found picture:", {
      pictureId: picture.id,
      url: picture.url,
      memoryId: picture.memoryId,
      bondId: picture.memory.bondId,
    });

    console.log("Attempting to delete from Cloudinary:", picture.url);
    const cloudinaryResult = await deleteFromCloudinary(picture.url);
    console.log("Cloudinary deletion result:", cloudinaryResult);

    console.log("Deleting picture from database:", pictureId);
    await prisma.picture.delete({
      where: {
        id: pictureId,
      },
    });

    revalidatePath(
      "/bond/" + picture.memory.bondId + "/memories" + picture.memoryId
    );
    return { success: true };
  } catch (error) {
    console.error("Error in deleteImage:", {
      error,
      stack: error instanceof Error ? error.stack : undefined,
      pictureId,
    });
    throw new Error("Failed to delete image");
  }
}
