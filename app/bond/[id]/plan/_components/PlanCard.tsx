"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BingoCell, Plan } from "@prisma/client";
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createMemory, deletePlan } from "../_actions/actions";

interface CellWithPlan extends BingoCell {
  plan: Plan | null;
}

export default function PlanCard({
  cell,
  bondId,
}: {
  cell: CellWithPlan;
  bondId: string;
}) {
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!cell.plan) return;

    try {
      const res = await deletePlan({
        bondId: bondId,
        planId: cell.plan.id,
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
    if (!cell.plan) return;

    try {
      if (cell.plan.planDate > new Date()) {
        toast.error("You cannot make memories of the future buddy");
        return;
      }

      const res = await createMemory({
        planId: cell.plan.id,
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

  if (!cell.plan) return null;

  const isToday =
    new Date().toDateString() === new Date(cell.plan.planDate).toDateString();
  const isPastDate = new Date(cell.plan.planDate) < new Date();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="w-full h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold flex items-center gap-3">
              <span className="text-xl">{cell.plan.emoji}</span>
              <span>{cell.activity}</span>
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {cell.plan.planDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-4" />
              {new Date(cell.plan.planDate).toLocaleDateString()}
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Badge
              variant={isPastDate && !isToday ? "secondary" : "default"}
              className="ml-auto group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
            >
              {isPastDate ? (isToday ? "Today" : "Past") : "Upcoming"}
            </Badge>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{cell.activity}</DialogTitle>
          <DialogDescription>
            If you have completed this plan, you can add this to your memories
            in order to preserve some valuable memories!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 items-center justify-center">
          <form onSubmit={(e) => addToMemories(e)} className="w-full">
            <Button className="w-full">Add To Memories</Button>
          </form>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full" variant="outline">
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  You are about to delete this plan. This action cannot be
                  undone.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => handleSubmit(e)}>
                <Button variant="outline" className="w-full">
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
