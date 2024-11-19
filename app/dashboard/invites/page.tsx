import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";
import Header from "../_components/Header";
import HandleInvite from "./_components/HandleInvite";

export default async function Invites() {
  const { userId } = await auth();

  const invites = await prisma.invite.findMany({
    where: {
      userId: userId!,
    },
    include: {
      bond: true,
    },
  });
  return (
    <div>
      <Header headerTitle="Invites" />

      <div className="px-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {invites.map((invite) => (
          <HandleInvite
            inviteId={invite.id}
            bondName={invite.bond.name}
            key={invite.id}
          />
        ))}

        {invites.length == 0 && (
          <div className="mt-2">
            <h2 className="text-2xl font-bold">No Invites Yet</h2>
            <p className="text-sm text-muted-foreground">
              Invite your friends to create a bond
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
