"use client";

import { Button } from "@/components/ui/button";
import { BingoCell, Plan } from "@prisma/client";
import { Calendar } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createMemory, deletePlan } from "../_actions/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BingoCellWithPlan extends BingoCell {
  plan:
    | (Plan & {
        cell: BingoCell;
      })
    | null;
}

export default function PlanCard({
  plan,
  bondId,
}: {
  plan: BingoCellWithPlan;
  bondId: string;
}) {
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!plan.plan) return;

    try {
      const res = await deletePlan({
        bondId: bondId,
        planId: plan.plan.id,
      });
      if (res.success) {
        toast.success("Plan deleted successfully");
        console.log("Plan deleted successfully");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }

  async function addToMemories(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!plan.plan) return;

    try {
      const res = await createMemory({
        planId: plan.plan.id,
        bondId: bondId,
        memoryDate: new Date(),
      });
      if (res.success) {
        toast.success(
          "Memory added successfully. Visit memories to add pictures!"
        );
        console.log("Memory added successfully");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }

  if (!plan.plan) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="p-3 rounded-xl block border h-full text-left shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-350"
        >
          <h2 className="font-light text-xl font-serif">{plan.activity}</h2>
          <p className="text-sm text-muted-foreground">
            {plan.plan.planDescription}
          </p>
          <p className="flex items-center gap-2 mt-4 text-sm">
            <Calendar className="size-4" />
            {plan.plan.planDate.toLocaleDateString()}
          </p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{plan.activity}</DialogTitle>
          <DialogDescription>
            If you have completed this plan, you can add this to your memories
            inorder to preserve some valuable memories!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 items-center justify-center">
          <form onSubmit={(e) => addToMemories(e)} className="w-full">
            <Button className="w-full">Add To Memories</Button>
          </form>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full" variant={"outline"}>
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  You are about to delete this plan. This action cannot be
                  undone
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => handleSubmit(e)}>
                <Button variant={"outline"} className="w-full">
                  Delete
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}
