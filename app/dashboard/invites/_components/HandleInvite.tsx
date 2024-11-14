"use client";
import { acceptInvite, rejectInvite } from "@/app/bond/[id]/_actions/actions";
import { Button } from "@/components/ui/button";
import React from "react";
import { toast } from "sonner";

export default function HandleInvite({ inviteId }: { inviteId: string }) {
  async function handleReject() {
    try {
      const response = await rejectInvite({ inviteId: inviteId });
      if (response.success) {
        toast.success("Invite rejected successfully");
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject the invite");
    }
  }

  async function handleAccept() {
    try {
      const response = await acceptInvite({ inviteId: inviteId });
      if (response.success) {
        toast.success("Invite accepted successfully");
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to accept the invite");
    }
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <Button variant={"link"} className="w-full" onClick={handleReject}>
        Reject
      </Button>
      <Button variant={"link"} className="w-full" onClick={handleAccept}>
        Accept
      </Button>
    </div>
  );
}
