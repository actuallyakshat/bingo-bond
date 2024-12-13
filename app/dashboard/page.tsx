import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";
import Header from "./_components/Header";
import { BondCard } from "./_components/BondCard";

export default async function Dashboard() {
  const { userId } = await auth();

  const data = await prisma.bond.findMany({
    where: {
      members: {
        some: {
          userId: userId!,
        },
      },
    },
    include: {
      members: {
        select: {
          id: true,
        },
      },
      memories: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="flex-1 w-full overflow-auto">
      <Header headerTitle="Your Bonds" />
      <div className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">Your Bonds</h2>
        <p className="text-sm text-muted-foreground">
          The list of bonds you are a part of
        </p>
        <div className="grid mt-5 gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((bond) => (
            <BondCard key={bond.id} bond={bond} />
          ))}

          {data.length == 0 && (
            <div className="mt-2 col-span-full">
              <p className="text-sm text-muted-foreground">
                Create your first bond to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
