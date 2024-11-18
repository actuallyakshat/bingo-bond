import React from "react";
import Header from "../_components/Header";
import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

export default async function Gallery() {
  const { userId } = await auth();

  if (!userId) {
    return null; // Or redirect to login
  }

  const memories = await prisma.memory.findMany({
    where: {
      bond: {
        OR: [
          { createdById: userId }, // Bonds created by the user
          {
            members: {
              some: {
                userId: userId,
              },
            },
          }, // Bonds where user is a member
        ],
      },
    },
    include: {
      pictures: true,
      bond: {
        select: {
          name: true,
        },
      },
      plan: {
        select: {
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
  });

  return (
    <div>
      <Header headerTitle="Gallery" />
      <div className="px-7">
        <h2 className="text-2xl font-bold mb-2">Gallery</h2>
        <p className="text-muted-foreground mb-6">
          A collection of memories from your various bonds!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((memory) => (
            <Link
              href={`/bond/${memory.bondId}/memories/${memory.id}`}
              key={memory.id}
              className="border rounded-lg p-4"
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
              {memory.pictures.length == 0 && (
                <div className="w-full h-48 bg-gray-200 rounded-md mb-3 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">No pictures</p>
                </div>
              )}
              <h3 className="font-semibold text-lg">{memory.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {memory.bond.name} •{" "}
                {new Date(memory.memoryDate).toLocaleDateString()}
              </p>
              {memory.plan?.cell && (
                <p className="text-sm text-primary">
                  Activity: {memory.plan.cell.activity}
                </p>
              )}
              <p className="text-sm mt-2">{memory.description}</p>
            </Link>
          ))}
        </div>

        {memories.length === 0 && (
          <div>
            <p className="text-lg text-muted-foreground">
              No memories yet! Create some memories in your bonds to see them
              here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
