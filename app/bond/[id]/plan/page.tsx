import { Button } from "@/components/ui/button";
import prisma from "@/db";
import { Cloud } from "lucide-react";
import Link from "next/link";
import BackToBond from "../_components/BackToBond";
import BondNotFound from "../_components/BondNotFound";
import CreatePlanDialog from "./_components/CreatePlanDialog";
import PlanCard from "./_components/PlanCard";

export default async function PlanPage({ params }: { params: { id: string } }) {
  const bond = await prisma.bond.findUnique({
    where: {
      id: params.id,
    },
    include: {
      members: true,
      bingoCard: {
        include: {
          cells: {
            include: {
              plan: true,
            },
          },
        },
      },
    },
  });

  if (!bond || !bond.bingoCard) return <BondNotFound />;

  const unplannedCells = bond.bingoCard.cells.filter((cell) => !cell.plan);
  const plannedCells = bond.bingoCard.cells.filter(
    (cell) => cell.plan! && !cell.plan.completed
  );

  return (
    <>
      <header className="pt-4 px-3 w-full flex items-center justify-between">
        <BackToBond bondId={params.id} />
        <Link href={"/bond/" + params.id + "/memories"}>
          <Button variant={"link"}>
            <Cloud />
            Memories
          </Button>
        </Link>
      </header>

      <div className="max-w-screen-md mx-auto pt-5">
        <div className="space-y-1.5">
          <h1 className="text-center font-extrabold text-4xl">
            Plans for <span className="text-primary">{bond.name}</span>
          </h1>
          <p className="text-center text-muted-foreground text-sm font-medium">
            {bond.description}
          </p>
        </div>

        <CreatePlanDialog
          bond={bond}
          cardId={bond.bingoCard.id}
          unplannedActivites={unplannedCells}
        />

        <hr className="pt-2" />

        <div className="grid lg:grid-cols-3 grid-cols-1 mt-3 gap-4">
          {plannedCells.map((cell) => {
            return <PlanCard key={cell.id} cell={cell} bondId={bond.id} />;
          })}
        </div>

        {plannedCells.length == 0 && (
          <div>
            <h2 className="text-xl font-bold">No Plans Yet</h2>
            <p className="text-sm text-muted-foreground">
              Create some plans or revisit memories maybe?
            </p>
          </div>
        )}
      </div>
    </>
  );
}
