"use client";
import Image from "next/image";
import React from "react";

interface PictureCardProps {
  picture: Picture;
}

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

interface Picture {
  id: string;
  url: string;
  memoryId: string;
  createdAt: Date;
}

export default function PictureCard({ picture }: PictureCardProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function handleDeleteImage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await deleteImage({
        pictureId: picture.id,
      });

      setLoading(false);

      if (response.success) {
        console.log("Image deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Image
          src={picture.url}
          alt="a memorable picture"
          width={1080}
          height={1080}
          className="w-full h-48 object-cover cursor-pointer rounded-md"
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Picture Options</DialogTitle>
          <DialogDescription>
            Don&apos;t like this picture? Delete it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => handleDeleteImage(e)}>
          <Button variant={"outline"} className="w-full" disabled={loading}>
            Delete
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
