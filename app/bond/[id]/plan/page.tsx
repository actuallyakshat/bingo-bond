import React from "react";
import AddFriendDialog from "../_components/AddFriendDialog";
import BackToBond from "../_components/BackToBond";
import prisma from "@/db";

export default async function Plan({ params }: { params: { id: string } }) {
  const bond = await prisma.bond.findUnique({
    where: {
      id: params.id,
    },
    include: {
      members: true,
      bingoCard: {
        include: {
          cells: true,
        },
      },
    },
  });

  if (!bond) return <div>Bond not found</div>;

  return (
    <>
      <header className="pt-4 px-3 w-full flex items-center justify-between">
        <BackToBond bondId={params.id} />
      </header>

      <div className="max-w-screen-md mx-auto py-5">
        <div className="space-y-1.5">
          <h1 className="text-center font-extrabold text-4xl">
            Plans for {bond.name}
          </h1>
          <p className="text-center text-muted-foreground text-sm font-medium">
            {bond.description}
          </p>
        </div>

        <div>
          {bond.bingoCard?.cells.map((cell) => (
            <div key={cell.id}>
              <h2 className="text-xl font-bold">{cell.activity}</h2>
              <p className="text-sm text-muted-foreground">{cell.position}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
