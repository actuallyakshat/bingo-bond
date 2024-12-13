"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { deleteMember } from "../_actions/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, UserMinus } from "lucide-react";

export default function RemoveMemberDropdown({
  bondId,
  userId,
}: {
  bondId: string;
  userId: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleRemoveMember() {
    toast.loading("Removing Friend", { id: "remove-friend" });
    setLoading(true);
    try {
      const result = await deleteMember({ bondId, userId });
      console.log(result);
      if (result.success) {
        toast.success("Friend Removed", { id: "remove-friend" });
      } else {
        toast.error(result.error, { id: "remove-friend" });
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message, { id: "remove-friend" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={loading}>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled={loading} onClick={handleRemoveMember}>
          <UserMinus className="mr-1 h-4 w-4" />
          <span>Remove member</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
