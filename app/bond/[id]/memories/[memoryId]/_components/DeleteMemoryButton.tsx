"use client";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import React from "react";
import { deleteMemory } from "../_actions/actions";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function DeleteMemoryButton({
  bondId,
  memoryId,
}: {
  memoryId: string;
  bondId: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  async function handleDeleteMemory() {
    try {
      setLoading(true);

      const response = await deleteMemory({
        memoryId: memoryId,
      });

      setLoading(false);

      if (response.success) {
        console.log("Memory deleted successfully");
        router.replace("/bond/" + bondId + "/memories");
      }
    } catch (error) {
      console.error("Error deleting memory:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"link"}>
          <TrashIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This memory will be deleted forever. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleDeleteMemory();
          }}
        >
          <Button
            variant={"outline"}
            className="w-full"
            disabled={loading}
            type={"submit"}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
