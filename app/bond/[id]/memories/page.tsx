import { Button } from "@/components/ui/button";
import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import BondNotFound from "../_components/BondNotFound";

type Memory = {
  id: string;
  name: string;
  description: string;
  memoryDate: Date;
  bondId: string;
  pictures: {
    id: string;
    url: string;
  }[];
  plan: {
    planDescription: string;
    cell: {
      activity: string;
    };
  } | null;
};

type MemoryCardProps = {
  memory: Memory;
};

function MemoryCard({ memory }: MemoryCardProps) {
  return (
    <Link
      href={`/bond/${memory.bondId}/memories/${memory.id}`}
      className="block border rounded-lg p-4 hover:border-primary transition-colors"
    >
      {memory.pictures[0] && (
        <Image
          width={400}
          height={400}
          src={memory.pictures[0].url}
          alt={memory.name}
          className="w-full h-48 object-cover rounded-md mb-3"
        />
      )}
      {memory.pictures.length === 0 && (
        <div className="w-full h-48 bg-gray-200 rounded-md mb-3 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">No pictures</p>
        </div>
      )}
      <h3 className="font-semibold text-lg">{memory.name}</h3>
      <p className="text-sm text-muted-foreground mb-2">
        {new Date(memory.memoryDate).toLocaleDateString()}
      </p>
      {memory.plan?.cell && (
        <p className="text-sm text-primary">
          Activity: {memory.plan.cell.activity}
        </p>
      )}
      <p className="text-sm mt-2 text-muted-foreground">{memory.description}</p>
    </Link>
  );
}

export default async function MemoriesPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = await auth();

  if (!userId) return null;

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
          pictures: true,
          plan: {
            select: {
              planDescription: true,
              cell: {
                select: {
                  activity: true,
                },
              },
            },
          },
        },
        orderBy: {
          memoryDate: "desc",
        },
      },
    },
  });

  if (!bond) return <BondNotFound />;

  const isMember = bond.members.some((member) => member.userId === userId);
  if (!isMember) return <div>Unauthorized</div>;

  return (
    <>
      <header className="pt-4 px-3 w-full flex items-center justify-between">
        <Link href={`/bond/${params.id}/plan`}>
          <Button variant="link" className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to Plans
          </Button>
        </Link>
      </header>

      <div className="max-w-screen-md mx-auto py-5 px-4">
        <div className="mb-8">
          <h1 className="text-center font-extrabold text-4xl">
            Memories for <span className="text-primary">{bond.name}</span>
          </h1>
          <hr className="mt-4" />
        </div>

        {bond.memories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bond.memories.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} />
            ))}
          </div>
        )}

        {bond.memories.length === 0 && (
          <div>
            <h2 className="font-bold text-xl">No Memories Yet</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Create your first memory to get started
            </p>
          </div>
        )}
      </div>
    </>
  );
}
