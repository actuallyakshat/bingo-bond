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
        <Button variant={"link"} className="pl-0 text-sm">
          Create Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 w-[95vw] max-w-md sm:max-w-lg md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">
            Hooray! Let&apos;s Make a plan
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Tell us about your plan before we create it for you.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-4 sm:gap-5"
          onSubmit={(e) => handleSubmit(e)}
        >
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Plan</Label>
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

          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Emoji</Label>
            <div className="font-medium my-2 text-base sm:text-lg text-muted-foreground">
              Selected Emoji: {emoji}
            </div>
            <EmojiPicker
              open={unplannedActivities.length > 0}
              defaultSkinTone={SkinTones.LIGHT}
              onEmojiClick={(e) => setEmoji(e.emoji)}
              lazyLoadEmojis={true}
              searchPlaceHolder="Find an emoji that fits your plan"
              height={300}
              width="100%"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Description</Label>
            <Textarea
              disabled={!selectedPlan}
              placeholder="We are going to visit The Big Chill Cafe at Khan Market"
              onChange={(e) => setDescription(e.target.value)}
              className="max-h-[200px] sm:max-h-[300px] text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Date</Label>
            <DatePicker
              date={date}
              setDate={setDate}
              disabled={!selectedPlan}
            />
          </div>

          <Button
            className="w-full text-sm sm:text-base"
            type={"submit"}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
