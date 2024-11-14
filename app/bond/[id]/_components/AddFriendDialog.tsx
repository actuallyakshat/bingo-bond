"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { addMember } from "../_actions/actions";

export default function AddFriendDialog({ bondId }: { bondId: string }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (!email) {
        toast.error("Please enter an email address");
        return;
      }

      setLoading(true);

      const response = await addMember({
        bondId: bondId,
        email: email,
      });

      setLoading(false);

      if (response.success) {
        toast.success("Invite sent successfully");
        setOpen(false);
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send the invite");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"link"}>
          <Plus className="size-5" />
          Add Friends
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a friend to this bond</DialogTitle>
          <DialogDescription>
            Simply add your friend&apos;s email address to invite them to your
            bond
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-3" onSubmit={(e) => handleSubmit(e)}>
          <div className="space-y-1.5">
            <Label>Email address</Label>
            <Input
              type="email"
              placeholder="johndoe@example.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <Button className="w-full" type={"submit"} disabled={loading}>
            Invite
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
