"use client";

import { acceptInvite, rejectInvite } from "@/app/bond/[id]/_actions/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function HandleInvite({
  inviteId,
  bondName,
}: {
  inviteId: string;
  bondName: string;
}) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  async function handleReject() {
    setIsRejecting(true);
    try {
      const response = await rejectInvite({ inviteId: inviteId });
      if (response.success) {
        toast.success("Invite rejected successfully");
      } else {
        toast.error(response.error || "Failed to reject the invite");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsRejecting(false);
    }
  }

  async function handleAccept() {
    setIsAccepting(true);
    try {
      const response = await acceptInvite({ inviteId: inviteId });
      if (response.success) {
        toast.success("Invite accepted successfully");
      } else {
        toast.error(response.error || "Failed to accept the invite");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsAccepting(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{bondName}</CardTitle>
        <CardDescription>
          You have been invited to join {bondName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-sm mb-2">
          Would you like to accept this invitation?
        </p>
      </CardContent>
      <CardFooter className="flex justify-between gap-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleReject}
          disabled={isRejecting || isAccepting}
        >
          <XCircle className="mr-2 h-4 w-4" />
          {isRejecting ? "Rejecting..." : "Reject"}
        </Button>
        <Button
          variant="default"
          className="w-full"
          onClick={handleAccept}
          disabled={isAccepting || isRejecting}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          {isAccepting ? "Accepting..." : "Accept"}
        </Button>
      </CardFooter>
    </Card>
  );
}
