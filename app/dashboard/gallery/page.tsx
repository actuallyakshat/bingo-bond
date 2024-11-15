import React from "react";
import Header from "../_components/Header";
import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";

export default async function Gallery() {
  const { userId } = await auth();
  const user = await prisma.user.findUnique({
    where: {
      id: userId!,
    },
    include: {
      memberships: {
        include: {
          bond: {
            include: {
              bingoCard: {
                include: {
                  cells: {
                    include: {
                      plan: {
                        include: {
                          memory: {
                            include: {
                              pictures: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return (
    <div>
      <Header headerTitle="Gallery" />
      <div className="px-7">
        <h2>Gallery</h2>
        <p>A collection of memories from your various bonds!</p>
      </div>
    </div>
  );
}
