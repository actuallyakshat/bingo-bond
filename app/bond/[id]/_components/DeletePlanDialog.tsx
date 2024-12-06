"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import React, { useState } from "react";
import { deletePlan } from "../_actions/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DeletePlanDialog({ bondId }: { bondId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      toast.loading("Deleting bond", { id: "delete-bond" });
      const response = await deletePlan({ bondId: bondId });
      setLoading(false);
      if (response.success) {
        toast.success("Plan deleted successfully", { id: "delete-bond" });
        setOpen(false);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete the bond", { id: "delete-bond" });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setOpen(true);
    } else {
      // Add a small delay before closing to prevent immediate closure on mobile
      setTimeout(() => {
        setOpen(false);
      }, 100);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="hidden md:flex"
          onClick={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          <Trash className="size-5 mr-2" /> Delete
        </Button>
      </DialogTrigger>
      <DialogTrigger asChild>
        <button
          className="flex w-full text-sm outline-none transition-colors items-center gap-2 md:hidden"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
        >
          <Trash className="size-4 mr-2" /> Delete
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            You are about to delete this bond. This means you and all other
            members will lose all the plans and memories of this bond. This
            action is irreversible.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <Button className="w-full" disabled={loading} type="submit">
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
