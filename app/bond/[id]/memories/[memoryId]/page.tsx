import { Button } from "@/components/ui/button";
import prisma from "@/db";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FileUploadButton from "./_components/FileUploadButton";

export default async function MemoryPage({
  params,
}: {
  params: { memoryId: string; id: string };
}) {
  const memory = await prisma.memory.findUnique({
    where: {
      id: params.memoryId,
    },

    include: {
      pictures: true,
      plan: {
        include: {
          cell: {
            select: {
              activity: true,
            },
          },
        },
      },
    },
  });

  if (!memory) return <div>Memory not found</div>;

  return (
    <div>
      <header className="pt-4 px-3 w-full flex items-center justify-between">
        <Link href={"/bond/" + params.id + "/memories"}>
          <Button variant={"link"}>
            <ChevronLeft />
            Back to Memories
          </Button>
        </Link>
      </header>
      <div className="max-w-screen-md mx-auto py-5">
        <div className="space-y-1.5">
          <h1 className="text-center font-extrabold text-4xl">
            Memories for{" "}
            <span className="text-primary">{memory.plan.cell.activity}</span>
          </h1>
          <p className="text-center text-muted-foreground text-sm font-medium">
            {memory.plan.planDescription}
          </p>
        </div>
        <hr className="my-2" />

        <FileUploadButton memoryId={memory.id} />

        <div className="grid md:grid-cols-3 mt-4 grid-cols-1 gap-2">
          {memory.pictures.map((picture) => (
            <PictureCard key={picture.id} picture={picture} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PictureCard({ picture }: { picture: any }) {
  return (
    <Image
      src={picture.url}
      alt={picture.caption}
      width={1080}
      height={1080}
      className="w-full"
    />
  );
}
