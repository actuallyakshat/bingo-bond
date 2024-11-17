import { Button } from "@/components/ui/button";
import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function MemoriesPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = await auth();
  const bond = await prisma.bond.findUnique({
    where: {
      id: params.id,
    },
    include: {
      members: {
        select: {
          userId: true,
        },
      },
      memories: {
        include: {
          plan: {
            include: {
              cell: {
                select: {
                  id: true,
                  activity: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!bond) return <div>Bond not found</div>;

  const isMember = bond.members.some((member) => member.userId == userId);
  if (!isMember) return <div>Unauthorized</div>;

  return (
    <>
      <header className="pt-4 px-3 w-full flex items-center justify-between">
        <Button variant={"link"}>
          <ChevronLeft />
          <Link href={"/bond/" + params.id + "/plan"}>Back to Plans</Link>
        </Button>
      </header>
      <div className="max-w-screen-md mx-auto py-5">
        <div>
          <h1 className="text-center font-extrabold text-4xl">
            Memories for <span className="text-primary">{bond.name}</span>
          </h1>
          <hr className="mt-4" />
        </div>

        <div className="mt-8 flex flex-col gap-4">
          {bond.memories.map((memory) => (
            <MemoryCard memory={memory} key={memory.id} />
          ))}
        </div>

        {bond.memories.length == 0 && (
          <div className="mt-5">
            <p className="text-sm text-muted-foreground">
              Create your first memories to get started
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function MemoryCard({ memory }: { memory: any }) {
  return (
    <Link
      key={memory.id}
      href={"/bond/" + memory.bondId + "/memories/" + memory.id}
    >
      <h3 className="font-extrabold text-2xl">{memory.plan.cell.activity}</h3>
      <p className="text-sm font-medium text-muted-foreground">
        {memory.plan.planDescription}
      </p>
    </Link>
  );
}
