import prisma from "@/db";
import NavigateBackButton from "../../_components/NavigateBackButton";
import DeleteMemoryButton from "./_components/DeleteMemoryButton";
import FileUploadButton from "./_components/FileUploadButton";
import PictureCard from "./_components/PictureCard";
import { Calendar } from "lucide-react";

interface MemoryPageProps {
  params: {
    memoryId: string;
    id: string;
  };
}

export default async function MemoryPage({ params }: MemoryPageProps) {
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
        <NavigateBackButton />
      </header>
      <div className="max-w-screen-md mx-auto p-5">
        <div className="space-y-3">
          <h1 className="text-center font-extrabold text-2xl md:text-4xl">
            Memories for <span className="text-primary">{memory.name}</span>
          </h1>
          <div className="font-medium flex text-sm md:text-base items-center justify-center gap-2">
            <Calendar className="size-5" />
            {memory.date.toLocaleDateString()}
          </div>
        </div>
        <hr className="my-2" />

        <div className="w-full flex items-center justify-between">
          <FileUploadButton memoryId={memory.id} />
          <DeleteMemoryButton memoryId={memory.id} bondId={params.id} />
        </div>

        <div className="grid md:grid-cols-2 mt-4 grid-cols-1 gap-2">
          {memory.pictures.map((picture) => (
            <PictureCard key={picture.id} picture={picture} />
          ))}
        </div>
      </div>
    </div>
  );
}
