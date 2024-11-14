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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await deletePlan({ bondId: bondId });
      toast.loading("Deleting bond", { id: "delete-bond" });
      if (response.success) {
        toast.success("Plan deleted successfully", { id: "delete-bond" });
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete the bond", { id: "delete-bond" });
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"link"}>
          <Trash className="size-5" /> Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            You are about to delete this bond. This means you and all other
            memebers will lose all the plans and memories of this bond. This
            action is irreversible.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-3" onSubmit={(e) => handleSubmit(e)}>
          <Button className="w-full" disabled={loading} type={"submit"}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
