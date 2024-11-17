import prisma from "@/db";
import BackToBond from "../_components/BackToBond";
import { Button } from "@/components/ui/button";
import { Cloud } from "lucide-react";
import BondNotFound from "../_components/BondNotFound";
import CreatePlanDialog from "./_components/CreatePlanDialog";
import Link from "next/link";
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
          plans: {
            orderBy: {
              planDate: "asc",
            },
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
      OR: [
        {
          plan: null,
        },
        {
          plan: {
            completed: false,
          },
        },
      ],
    },
    include: {
      plan: {
        include: {
          cell: true,
        },
      },
    },
  });

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

      <div className="max-w-screen-md mx-auto py-5">
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
          unplannedActivites={unplannedIncompleteCells}
        />

        <hr className="pt-2" />

        <div className="grid lg:grid-cols-3 grid-cols-1 mt-3 gap-4">
          {unplannedIncompleteCells.map((cell) => {
            return <PlanCard key={cell.id} plan={cell} bondId={bond.id} />;
          })}
        </div>

        {unplannedIncompleteCells.length == 0 && (
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
