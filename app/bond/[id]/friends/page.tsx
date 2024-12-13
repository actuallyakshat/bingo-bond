import prisma from "@/db";
import AddFriendDialog from "../_components/AddFriendDialog";
import BackToBond from "../_components/BackToBond";
import RemoveMemberDropdown from "../_components/RemoveMemberDropdown";
import { auth } from "@clerk/nextjs/server";
import Unauthorised from "@/components/Unauthorised";
import BondNotFound from "../_components/BondNotFound";

export default async function Friends({ params }: { params: { id: string } }) {
  const { userId } = await auth();
  const bond = await prisma.bond.findUnique({
    where: {
      id: params.id,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!bond) return <BondNotFound />;

  const isMember = bond.members.some((member) => member.userId === userId);

  if (!isMember) {
    return <Unauthorised />;
  }

  const isCreator = userId == bond.createdById;

  return (
    <>
      <header className="pt-4 px-3 w-full flex items-center justify-between">
        <BackToBond bondId={bond.id} />

        <div className="flex items-center gap-1">
          <AddFriendDialog bondId={bond.id} />
        </div>
      </header>

      <div className="max-w-screen-md mx-auto p-5">
        <div className="space-y-1.5">
          <h1 className="text-center font-extrabold text-2xl md:text-4xl">
            Members of <span className="text-primary">{bond.name}</span>
          </h1>
          <p className="text-center text-muted-foreground text-sm font-medium">
            {bond.members.length == 1
              ? "1 Member"
              : bond.members.length + " Members"}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {bond.members.map((member) => (
            <div key={member.id} className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{member.user.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {member.user.email}
                </p>
              </div>
              {isCreator && userId != member.user.id && (
                <RemoveMemberDropdown
                  bondId={bond.id}
                  userId={member.user.id}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
