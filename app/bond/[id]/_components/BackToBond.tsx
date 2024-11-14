import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function BackToBond({ bondId }: { bondId: string }) {
  return (
    <Link href={"/bond/" + bondId}>
      <Button variant={"link"}>
        <ChevronLeft />
        Back to Bond
      </Button>
    </Link>
  );
}
