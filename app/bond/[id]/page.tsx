import prisma from "@/db";
import React from "react";
import Grid from "./_components/Grid";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface BondPageProps {
  params: {
    id: string;
  };
}

export default async function BondPage({ params }: BondPageProps) {
  const data = await prisma.bond.findUnique({
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

  console.log(data?.bingoCard);

  if (!data) return <div>Bond not found</div>;

  return (
    <>
      <header className="pt-4">
        <Link href={"/dashboard"}>
          <Button variant={"link"}>
            <ChevronLeft />
            Back to Dashboard
          </Button>
        </Link>
      </header>

      <div className="max-w-screen-md mx-auto py-5">
        <div className="space-y-1.5">
          <h1 className="text-center font-extrabold text-4xl">{data.name}</h1>
          <p className="text-center text-muted-foreground text-sm font-medium">
            {data.description}
          </p>
        </div>
        <Grid data={data} />
      </div>
    </>
  );
}
