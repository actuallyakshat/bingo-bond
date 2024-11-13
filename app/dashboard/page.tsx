import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";
import AddBondButton from "./_components/AddFormButton";
import SidebarComponent from "./_components/Sidebar";
import Link from "next/link";

export default function Dashboard() {
  return (
    <SidebarProvider>
      <div className="grid h-full min-h-screen w-screen grid-cols-[auto_1fr]">
        <SidebarComponent />
        <SidebarInset className="flex flex-col">
          <header className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-light">Your Bonds</h1>
            </div>
            <AddBondButton />
          </header>
          <MainContent />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export async function MainContent() {
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
    <main className="flex-1 overflow-auto p-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((bond) => (
          <Link href={`/bond/${bond.id}`} key={bond.id}>
            <h2 className="text-2xl font-bold">{bond.name}</h2>
            <p>{bond.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
