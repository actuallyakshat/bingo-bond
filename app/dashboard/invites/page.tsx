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

      <div className="px-7 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {invites.map((invite) => (
          <div
            key={invite.id}
            className="border rounded-2xl shadow-sm px-6 pt-4"
          >
            <h2 className="text-xl font-bold">{invite.bond.name}</h2>
            <p className="text-sm text-muted-foreground">
              {invite.bond.description}
            </p>
            <HandleInvite inviteId={invite.id} />
          </div>
        ))}

        {invites.length == 0 && (
          <div className="mt-2">
            <h2 className="text-xl font-bold">No Invites Yet</h2>
            <p className="text-sm text-muted-foreground">
              Invite your friends to create a bond
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
