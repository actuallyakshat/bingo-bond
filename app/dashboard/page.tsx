import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import Header from "./_components/Header";

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
  });

  console.log(data);

  return (
    <main className="flex-1 overflow-auto">
      <Header headerTitle="Your Bonds" />
      <div className="grid px-8 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((bond) => (
          <Link href={`/bond/${bond.id}`} key={bond.id}>
            <h2 className="text-xl font-bold">{bond.name}</h2>
            <p>{bond.description}</p>
          </Link>
        ))}

        {data.length == 0 && (
          <div className="mt-2">
            <h2 className="text-xl font-bold">No Bonds Yet</h2>
            <p className="text-sm text-muted-foreground">
              Create your first bond to get started
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
