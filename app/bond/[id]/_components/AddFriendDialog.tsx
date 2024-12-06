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
import { Plus } from "lucide-react";
import React, { useState } from "react";
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
        setEmail(""); // Reset email input after successful submission
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send the invite");
    } finally {
      setLoading(false);
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setOpen(true);
    } else {
      // Add a small delay before closing to prevent immediate closure on mobile
      setTimeout(() => {
        setOpen(false);
        setEmail(""); // Reset email input when dialog is closed
      }, 100);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="hidden md:flex"
          onClick={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          <Plus className="size-5 mr-2" />
          Add Friends
        </Button>
      </DialogTrigger>
      <DialogTrigger asChild>
        <button
          className="w-full text-sm text-primary items-center flex md:hidden"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
        >
          <Plus className="size-4 mr-4" />
          Add Member
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a friend to this bond</DialogTitle>
          <DialogDescription>
            Simply add your friend&apos;s email address to invite them to your
            bond
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="johndoe@example.com"
              className="w-full"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Inviting..." : "Invite"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
