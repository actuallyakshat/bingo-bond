"use client";

import Image from "next/image";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteImage } from "../_actions/actions";
import { Expand, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";

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
  const [optionsOpen, setOptionsOpen] = React.useState(false);
  const [fullscreenOpen, setFullscreenOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function handleDeleteImage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await deleteImage({
        pictureId: picture.id,
      });

      if (response.success) {
        toast.success("Image deleted successfully");
        setOptionsOpen(false);
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
      {/* Options Dialog */}
      <Dialog open={optionsOpen} onOpenChange={setOptionsOpen}>
        <DialogTrigger asChild>
          <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
            <CardContent className="p-0">
              <div className="relative">
                <AspectRatio ratio={1}>
                  <Image
                    src={picture.url}
                    alt="Memory photograph"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </AspectRatio>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFullscreenOpen(true);
                    }}
                  >
                    <Expand className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" className="h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Picture Options</DialogTitle>
            <DialogDescription>
              What would you like to do with this picture?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setOptionsOpen(false);
                setFullscreenOpen(true);
              }}
            >
              View Full Image
            </Button>
            <form onSubmit={handleDeleteImage}>
              <Button
                type="submit"
                variant="destructive"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete Image"}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
        <DialogContent className="max-w-[80vw] block h-[80vh]">
          <DialogHeader className="h-fit pb-3">
            <DialogTitle>
              Memory from {picture.createdAt.toLocaleDateString()}
            </DialogTitle>
          </DialogHeader>
          <div className="relative py-10 w-full h-full">
            <Image
              src={picture.url}
              alt="Memory photograph"
              fill
              quality={100}
              className="object-contain"
              sizes="80vw"
              priority
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
