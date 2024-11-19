"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createPlan } from "../_actions/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import EmojiPicker, { SkinTones } from "emoji-picker-react";

// Interfaces for unplanned activities and props
interface UnplannedActivity {
  id: string;
  activity: string;
  position: number;
  plan: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    cardId: string;
    cellId: string;
    planDate: Date;
    planDescription: string;
    memoryId: string | null;
    completed: boolean;
  } | null;
}

interface CreatePlanDialogProps {
  bond: {
    id: string;
    name: string;
    description: string | null;
  };
  cardId: string;
  unplannedActivities: UnplannedActivity[];
}

export default function CreatePlanDialog({
  cardId,
  unplannedActivities,
}: CreatePlanDialogProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [emoji, setEmoji] = useState<string>();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (!selectedPlan || !description || !date || !emoji) {
        toast.error("Please fill all the fields");
        return;
      }

      setLoading(true);

      const plan = await createPlan({
        cellId: selectedPlan,
        cardId: cardId,
        planDate: date,
        planDescription: description,
        emoji,
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
      <DialogContent className="max-h-[80vh] overflow-y-scroll noscrollbar">
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
              disabled={unplannedActivities.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    unplannedActivities.length === 0
                      ? "No Unplanned Activities"
                      : "Select Plan"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {unplannedActivities.map((cell) => (
                  <SelectItem key={cell.id} value={cell.id}>
                    {cell.activity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Emoji</Label>
            <div className="font-medium my-2 text-lg text-muted-foreground">
              Selected Emoji: {emoji}
            </div>
            <EmojiPicker
              open={unplannedActivities.length > 0}
              defaultSkinTone={SkinTones.LIGHT}
              onEmojiClick={(e) => setEmoji(e.emoji)}
              lazyLoadEmojis={true}
              searchPlaceHolder="Find an emoji that fits your plan"
              height={400}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              disabled={!selectedPlan}
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
              disabled={!selectedPlan}
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
