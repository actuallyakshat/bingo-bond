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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BingoCard, BingoCell, Bond } from "@prisma/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createActivity, deleteActivity } from "../_actions/actions";
import { convertToPascalCase } from "@/lib/utils";

interface BingoCardWithCells extends BingoCard {
  cells: BingoCell[];
}

interface DataProp extends Bond {
  bingoCard: BingoCardWithCells | null;
}

export default function Grid({ data }: { data: DataProp }) {
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialogs, setOpenDialogs] = useState<{ [key: number]: boolean }>(
    {}
  );

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

      const formattedName = convertToPascalCase(name);

      console.log(formattedName);

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

  const gridItems = Array.from({ length: 16 }, (_, i) => {
    const cellData = data.bingoCard?.cells.find((cell) => cell.position === i);

    return (
      <Dialog
        key={i}
        open={openDialogs[i]}
        onOpenChange={(open) => handleOpenChange(i, open)}
      >
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full h-full aspect-square"
            onClick={() => setSelectedCell(i)}
          >
            {cellData ? (
              <p className="font-bold text-lg text-wrap">{cellData.activity}</p>
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
            {cellData ? (
              <Button
                variant={"outline"}
                type="button"
                disabled={loading}
                onClick={() => handleDeleteActivity(Number(selectedCell))}
              >
                Delete
              </Button>
            ) : null}
          </form>
        </DialogContent>
      </Dialog>
    );
  });

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-4 gap-2">{gridItems}</div>
    </div>
  );
}
