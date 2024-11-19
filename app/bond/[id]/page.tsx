import { Button } from "@/components/ui/button";
import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";
import { CalendarCheck2, ChevronLeft, User, Menu } from "lucide-react";
import Link from "next/link";
import AddFriendDialog from "./_components/AddFriendDialog";
import BondNotFound from "./_components/BondNotFound";
import DeletePlanDialog from "./_components/DeletePlanDialog";
import Grid from "./_components/Grid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      bingoCard: {
        include: {
          cells: {
            include: {
              plan: {
                select: {
                  completed: true,
                },
              },
            },
          },
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
          <Button variant={"link"} className="p-2 sm:p-4">
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden md:inline ml-2">Back to Dashboard</span>
          </Button>
        </Link>

        <div className="flex items-center gap-1">
          <div className="hidden md:flex items-center gap-1">
            <Link href={"/bond/" + bond.id + "/plan"}>
              <Button variant={"link"}>
                <CalendarCheck2 className="mr-2" />
                Plan
              </Button>
            </Link>

            <Link href={"/bond/" + bond.id + "/friends"}>
              <Button variant={"link"}>
                <User className="mr-2" />
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

          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[150px]">
                <DropdownMenuItem asChild>
                  <Link
                    href={"/bond/" + bond.id + "/plan"}
                    className="w-full flex items-center"
                  >
                    <CalendarCheck2 className="mr-2 h-4 w-4" />
                    Plan
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={"/bond/" + bond.id + "/friends"}
                    className="w-full flex items-center"
                  >
                    <User className="mr-2 h-4 w-4" />
                    All Members
                  </Link>
                </DropdownMenuItem>
                {bond.createdById == userId && (
                  <>
                    <DropdownMenuItem>
                      <AddFriendDialog bondId={bond.id} />
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <DeletePlanDialog bondId={bond.id} />
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="max-w-screen-md mx-auto py-5 px-4 sm:px-6">
        <div className="space-y-1.5">
          <h1 className="text-center font-extrabold text-2xl sm:text-4xl text-primary">
            {bond.name}
          </h1>
          <p className="text-center text-muted-foreground text-xs sm:text-sm font-medium">
            {bond.description}
          </p>
        </div>
        <Grid data={bond} />
      </div>
    </>
  );
}
