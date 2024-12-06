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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { convertToTitleCase } from "@/lib/utils";
import { memo, useEffect, useState } from "react";
import { toast } from "sonner";
import { createActivity, deleteActivity } from "../_actions/actions";

interface Plan {
  completed: boolean;
}

interface BingoCell {
  id: string;
  cardId: string;
  position: number;
  activity: string;
  plan: Plan | null;
}

interface BingoCard {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  bondId: string;
  cells: BingoCell[];
}

interface Bond {
  id: string;
  name: string;
  description: string | null;
  createdById: string;
  bingoCard: BingoCard | null;
}

interface MemoriesProp {
  id: string;
  name: string;
}

export default function Grid({
  data,
  memories,
}: {
  data: Bond;
  memories: MemoriesProp[];
}) {
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialogs, setOpenDialogs] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [isMemoryDialogOpen, setIsMemoryDialogOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCell !== null) {
      const cellData = data.bingoCard?.cells.find(
        (cell) => cell.position === selectedCell
      );
      if (cellData?.activity) {
        setName(cellData.activity);
      } else {
        setName("");
      }
    }
  }, [selectedCell, data.bingoCard?.cells]);

  const handleOpenChange = (position: number, isOpen: boolean) => {
    setOpenDialogs((prev) => ({
      ...prev,
      [position]: isOpen,
    }));
    if (!isOpen) {
      setSelectedCell(null);
      setName("");
      setIsMemoryDialogOpen(false);
      setSelectedMemory(null);
    }
  };

  async function handleSubmit() {
    try {
      if (!name.trim()) {
        throw new Error("Please enter a valid name");
      }

      if (name.length > 24) {
        throw new Error("Activity name is too long");
      }

      if (selectedCell === null) {
        toast.error("Cell is not selected");
        return;
      }

      const formattedName = convertToTitleCase(name);

      setLoading(true);

      const response = await createActivity({
        cardId: data.bingoCard!.id,
        position: selectedCell,
        name: formattedName,
      });

      if (response.success && response.data) {
        toast.success("Plan saved!");
        handleOpenChange(selectedCell, false);
        setName("");
      }
    } catch (e) {
      const error = e as Error;
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddMemory() {
    if (!selectedMemory || selectedCell === null) return;

    try {
      setLoading(true);
      const response = await createActivity({
        cardId: data.bingoCard!.id,
        position: selectedCell,
        name: selectedMemory,
      });

      if (response.success && response.data) {
        toast.success("Memory added to the grid!");
        handleOpenChange(selectedCell, false);
        setIsMemoryDialogOpen(false);
        setSelectedMemory(null);
      }
    } catch (error) {
      toast.error("Failed to add memory to the grid");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteActivity(position: number) {
    try {
      setLoading(true);
      const response = await deleteActivity({
        cardId: data.bingoCard!.id,
        position,
      });

      setLoading(false);

      if (response.success) {
        toast.success("Activity deleted successfully");
        setOpenDialogs((prev) => ({
          ...prev,
          [position]: false,
        }));
      } else {
        toast.error(response.error);
      }
    } catch (e) {
      const error = e as Error;
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const memoriesNotInGrid = memories.filter(
    (memory) =>
      !data.bingoCard?.cells.some((cell) => cell.activity === memory.name)
  );

  const gridItems = Array.from({ length: 16 }, (_, i) => {
    const cellData = data.bingoCard?.cells.find((cell) => cell.position === i);
    const isCompleted =
      cellData?.plan?.completed ||
      memories.some((memory) => memory.name === cellData?.activity);

    return (
      <Dialog
        key={i}
        open={openDialogs[i]}
        onOpenChange={(open) => handleOpenChange(i, open)}
      >
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className={`w-full h-full aspect-square transition-colors ${
              isCompleted
                ? "bg-green-600 text-white hover:bg-green-700 hover:text-white"
                : ""
            }`}
            onClick={() => setSelectedCell(i)}
          >
            {cellData ? (
              <p className="font-bold text-sm md:text-base text-wrap">
                {cellData.activity}
              </p>
            ) : (
              <p className="text-muted-foreground text-xs">Enter plan</p>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tell us about your plan</DialogTitle>
            <DialogDescription>
              What idea do you have in mind buddy?
            </DialogDescription>
          </DialogHeader>

          {isMemoryDialogOpen ? (
            <div className="space-y-4">
              <Select onValueChange={setSelectedMemory}>
                <SelectTrigger disabled={!memoriesNotInGrid.length}>
                  <SelectValue
                    placeholder={
                      !memoriesNotInGrid.length
                        ? "No memories to select"
                        : "Select a memory"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {memoriesNotInGrid?.map((memory) => (
                    <SelectItem key={memory.id} value={memory.name}>
                      {memory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setIsMemoryDialogOpen(false)}
                >
                  Back
                </Button>
                <Button
                  onClick={handleAddMemory}
                  disabled={!selectedMemory || loading}
                >
                  {loading ? "Adding..." : "Add to Grid"}
                </Button>
              </div>
            </div>
          ) : (
            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="space-y-1.5">
                <Label>Plan</Label>
                <Input
                  placeholder="Trip to Manali"
                  maxLength={24}
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
              {!cellData && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsMemoryDialogOpen(true)}
                >
                  Add From Memories
                </Button>
              )}
              {cellData && (
                <Button
                  variant="outline"
                  type="button"
                  disabled={loading}
                  onClick={() => handleDeleteActivity(Number(selectedCell))}
                >
                  Delete
                </Button>
              )}
            </form>
          )}
        </DialogContent>
      </Dialog>
    );
  });

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">{gridItems}</div>
    </div>
  );
}
