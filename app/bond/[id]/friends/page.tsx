import { Button } from "@/components/ui/button";
import prisma from "@/db";
import { ChevronLeft } from "lucide-react";
import React from "react";
import AddFriendDialog from "../_components/AddFriendDialog";
import Link from "next/link";
import BackToBond from "../_components/BackToBond";

export default async function Friends({ params }: { params: { id: string } }) {
  const bond = await prisma.bond.findUnique({
    where: {
      id: params.id,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!bond) return <div>Bond not found</div>;

  return (
    <>
      <header className="pt-4 px-3 w-full flex items-center justify-between">
        <BackToBond bondId={bond.id} />

        <div className="flex items-center gap-1">
          <AddFriendDialog bondId={bond.id} />
        </div>
      </header>

      <div className="max-w-screen-md mx-auto py-5">
        <div className="space-y-1.5">
          <h1 className="text-center font-extrabold text-4xl">
            Members of {bond.name}
          </h1>
          <p className="text-center text-muted-foreground text-sm font-medium">
            {bond.members.length == 1
              ? "1 Member"
              : bond.members.length + " Members"}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {bond.members.map((member) => (
            <div key={member.id}>
              <h2 className="text-xl font-bold">{member.user.name}</h2>
              <p className="text-sm text-muted-foreground">
                {member.user.email}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
