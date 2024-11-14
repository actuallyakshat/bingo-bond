"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createPlan } from "../_actions/actions";

//TODO: use the right interface
interface Props {
  bond: any;
  cardId: string;
  unplannedActivites: any[];
}

export default function CreatePlanDialog({
  bond,
  cardId,
  unplannedActivites,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>(new Date());

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (!selectedPlan || !description || !date) {
        toast.error("Please fill all the fields");
        return;
      }

      setLoading(true);

      const plan = await createPlan({
        cellId: selectedPlan,
        cardId: cardId,
        planDate: date,
        planDescription: description,
      });

      setLoading(false);

      if (plan.success) {
        toast.success("Plan created successfully");
        setOpen(false);
      } else {
        toast.error(plan.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"link"} className="pl-0">
          Create Plan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hooray! Let&apos;s Make a plan</DialogTitle>
          <DialogDescription>
            Tell us about your plan before we create it for you.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-3" onSubmit={(e) => handleSubmit(e)}>
          <div className="space-y-1.5">
            <Label>Plan</Label>
            <Select
              onValueChange={(value) => setSelectedPlan(value)}
              disabled={unplannedActivites.length == 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    unplannedActivites.length == 0
                      ? "No Unplanned Activites"
                      : "Select Plan"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {unplannedActivites.map((cell: any) => (
                  <SelectItem key={cell.id} value={cell.id}>
                    {cell.activity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              disabled={selectedPlan == null}
              placeholder="We are going to visit The Big Chill Cafe at Khan Market"
              onChange={(e) => setDescription(e.target.value)}
              className="max-h-[300px]"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Date</Label>
            <DatePicker
              date={date}
              setDate={setDate}
              disabled={selectedPlan == null}
            />
          </div>

          <Button className="w-full" type={"submit"} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
