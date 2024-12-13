import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import React from "react";

export default function MemoryNotFound() {
  revalidatePath("/dashbaord");
  return (
    <div className="h-screen flex items-center justify-center flex-col gap-3">
      <h2 className="font-extrabold tracking-tight md:text-3xl text-2xl">
        Memory not found!
      </h2>
      <p className="text-lg">The memory you are looking for does not exists</p>
      <Link href={"/dashboard"}>
        <Button variant={"link"}>Go back to Dashboard</Button>
      </Link>
    </div>
  );
}
