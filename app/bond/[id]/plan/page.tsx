import prisma from "@/db";
import BackToBond from "../_components/BackToBond";

import CreatePlanDialog from "./_components/CreatePlanDialog";
import { Button } from "@/components/ui/button";
import { Cloud } from "lucide-react";
import BondNotFound from "../_components/BondNotFound";

export default async function Plan({ params }: { params: { id: string } }) {
  const bond = await prisma.bond.findUnique({
    where: {
      id: params.id,
    },
    include: {
      members: true,
      bingoCard: {
        include: {
          plans: {
            include: {
              cell: true,
            },
          },
        },
      },
    },
  });

  if (!bond || !bond.bingoCard) return <BondNotFound />;

  const unplannedIncompleteCells = await prisma.bingoCell.findMany({
    where: {
      cardId: bond.bingoCard.id,
      completed: false,
      plan: null,
    },
    include: {
      plan: true,
    },
  });

  return (
    <>
      <header className="pt-4 px-3 w-full flex items-center justify-between">
        <BackToBond bondId={params.id} />
        <Button variant={"link"}>
          <Cloud />
          Memories
        </Button>
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

        <CreatePlanDialog
          bond={bond}
          cardId={bond.bingoCard.id}
          unplannedActivites={unplannedIncompleteCells}
        />

        <hr className="pt-2" />

        <div>
          {bond.bingoCard.plans.map((plan) => {
            return <div key={plan.id}>{plan.cell.activity}</div>;
          })}
        </div>

        {bond.bingoCard.plans.length == 0 && (
          <div className="mt-2">
            <h2 className="text-xl font-bold">No Plans Yet</h2>
            <p className="text-sm text-muted-foreground">
              Create your first plan to get started
            </p>
          </div>
        )}
      </div>
    </>
  );
}
