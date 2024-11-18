import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import Header from "./_components/Header";
import { Calendar, ChevronRight, Users } from "lucide-react";

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
    },
  });

  return (
    <main className="flex-1 overflow-auto">
      <Header headerTitle="Your Bonds" />
      <div className="px-8">
        <h2 className="text-2xl font-bold">Your Bonds</h2>
        <p className="text-sm text-muted-foreground">
          The list of bonds you are a part of
        </p>
        <div className="grid mt-5 gap-3 grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
          {data.map((bond) => (
            <BondCard key={bond.id} bond={bond} />
          ))}

          {data.length == 0 && (
            <div className="mt-2">
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
interface Bond {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  members: {
    id: string;
  }[];
}

function BondCard({ bond }: { bond: Bond }) {
  return (
    <Link
      href={`/bond/${bond.id}`}
      className="group relative overflow-hidden rounded-xl bg-gradient-to-b from-neutral-600 to-neutral-950 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="absolute inset-0 opacity-20 transition-opacity duration-300 group-hover:opacity-30" />
      <div className="relative p-6 flex flex-col h-full">
        <h3 className="text-xl font-bold text-white mb-1">{bond.name}</h3>
        {bond.description && (
          <p className="text-sm text-muted-foreground dark mb-4 line-clamp-2">
            {bond.description}
          </p>
        )}
        <div className="mt-auto flex items-center text-sm dark text-foreground space-x-4">
          {bond.members.length > 0 && (
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>
                {bond.members.length}{" "}
                {bond.members.length > 1 ? "Members" : "Member"}
              </span>
            </div>
          )}
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{new Date(bond.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-md transform translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </div>
      </div>
    </Link>
  );
}
