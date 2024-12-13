"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateBondName } from "../_actions/actions";

export default function BondName({
  bondId,
  bondName,
}: {
  bondId: string;
  bondName: string;
}) {
  const [loading, setLoading] = React.useState(false);
  const [newName, setNewName] = React.useState(bondName);
  const [open, setOpen] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.loading("Saving New Name", { id: "update-name" });
    setLoading(true);

    try {
      const response = await updateBondName({
        bondId,
        name: newName,
      });

      if (response.success) {
        toast.success("Successfully updated the bond name", {
          id: "update-name",
        });
        setOpen(false);
      } else {
        toast.error(response.error, { id: "update-name" });
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message, { id: "update-name" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <h1 className="text-center hover:underline cursor-pointer font-extrabold text-2xl sm:text-4xl text-primary">
          {bondName}
        </h1>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Name</DialogTitle>
          <DialogDescription>
            If you wish to update the name of this bond, please enter a new name
            below.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
        >
          <div>
            <Label>New Name</Label>
            <Input
              placeholder="Desi Boys"
              defaultValue={bondName}
              onChange={(e) => setNewName(e.target.value)}
              maxLength={30}
            />
          </div>
          <Button className="w-full" disabled={loading}>
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
