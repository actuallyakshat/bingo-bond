import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToTitleCase(str: string) {
  return str
    .toLowerCase()
    .split(/[\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getCloudinaryAssetLink(publicId: string) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!publicId) {
    throw new Error(
      "Public ID is missing. Ensure the file is uploaded to Cloudinary."
    );
  }

  const assetLink = `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
  return assetLink;
}
