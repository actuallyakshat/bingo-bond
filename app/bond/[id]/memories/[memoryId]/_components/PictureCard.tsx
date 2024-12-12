"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { deleteImage } from "../_actions/actions";
import { toast } from "sonner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

interface Picture {
  id: string;
  url: string;
  memoryId: string;
  createdAt: Date;
}

interface PictureCardProps {
  picture: Picture;
}

export default function PictureCard({ picture }: PictureCardProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  async function handleDeleteImage(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await deleteImage({
        pictureId: picture.id,
      });

      if (response.success) {
        toast.success("Image deleted successfully");
        setIsModalOpen(false);
      } else {
        toast.error("Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Error deleting image");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Card
        className="overflow-hidden cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <CardContent className="p-0">
          <AspectRatio ratio={1}>
            <Image
              src={picture.url}
              alt="Memory photograph"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </AspectRatio>
        </CardContent>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto">
          <div className="bg-white rounded-lg w-[90vw] h-[90vh] flex flex-col my-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">
                Memory from {picture.createdAt.toLocaleDateString()}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex-grow relative overflow-hidden">
              <Image
                src={picture.url}
                alt="Memory photograph"
                fill
                quality={100}
                className="object-contain transition-all duration-300"
                sizes="90vw"
                priority
              />
            </div>
            <div className="flex justify-end gap-4 p-4 border-t">
              <Button
                variant="destructive"
                onClick={handleDeleteImage}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete Image"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
