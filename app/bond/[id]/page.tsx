import { Button } from "@/components/ui/button";
import prisma from "@/db";
import { CalendarCheck2, ChevronLeft, User } from "lucide-react";
import Link from "next/link";
import AddFriendDialog from "./_components/AddFriendDialog";
import Grid from "./_components/Grid";
import DeletePlanDialog from "./_components/DeletePlanDialog";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import BondNotFound from "./_components/BondNotFound";

interface BondPageProps {
  params: {
    id: string;
  };
}

export default async function BondPage({ params }: BondPageProps) {
  const { userId } = await auth();
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

  if (!bond) {
    return <BondNotFound />;
  }

  return (
    <>
      <header className="pt-4 px-3 w-full flex items-center justify-between">
        <Link href={"/dashboard"}>
          <Button variant={"link"}>
            <ChevronLeft />
            Back to Dashboard
          </Button>
        </Link>

        <div className="flex items-center gap-1">
          <Link href={"/bond/" + bond.id + "/plan"}>
            <Button variant={"link"}>
              <CalendarCheck2 />
              Plan
            </Button>
          </Link>

          <Link href={"/bond/" + bond.id + "/friends"}>
            <Button variant={"link"}>
              <User />
              All Members
            </Button>
          </Link>

          {bond.createdById == userId && (
            <>
              <AddFriendDialog bondId={bond.id} />

              <DeletePlanDialog bondId={bond.id} />
            </>
          )}
        </div>
      </header>

      <div className="max-w-screen-md mx-auto py-5">
        <div className="space-y-1.5">
          <h1 className="text-center font-extrabold text-4xl text-primary">
            {bond.name}
          </h1>
          <p className="text-center text-muted-foreground text-sm font-medium">
            {bond.description}
          </p>
        </div>
        <Grid data={bond} />
      </div>
    </>
  );
}
