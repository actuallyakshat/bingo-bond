"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function NavigateBackButton() {
  const router = useRouter();
  return (
    <div>
      <Button variant={"link"} onClick={() => router.back()}>
        <ChevronLeft />
        Go Back
      </Button>
    </div>
  );
}
