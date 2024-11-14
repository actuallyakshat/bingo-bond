import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import React from "react";

export default function BondNotFound() {
  revalidatePath("/dashbaord");
  return (
    <div className="h-screen flex items-center justify-center flex-col gap-1">
      <h2 className="font-medium text-2xl">Bond not found!</h2>
      <Link href={"/dashboard"}>
        <Button variant={"link"}>Go back to Dashboard</Button>
      </Link>
    </div>
  );
}
