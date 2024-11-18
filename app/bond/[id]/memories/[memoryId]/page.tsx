import prisma from "@/db";
import NavigateBackButton from "../../_components/NavigateBackButton";
import DeleteMemoryButton from "./_components/DeleteMemoryButton";
import FileUploadButton from "./_components/FileUploadButton";
import PictureCard from "./_components/PictureCard";

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
      <div className="max-w-screen-md mx-auto py-5">
        <div className="space-y-1.5">
          <h1 className="text-center font-extrabold text-4xl">
            Memories for{" "}
            <span className="text-primary">{memory?.plan?.cell?.activity}</span>
          </h1>
          <p className="text-center text-muted-foreground text-sm font-medium">
            {memory?.plan?.planDescription}
          </p>
        </div>
        <hr className="my-2" />

        <div className="w-full flex items-center justify-between">
          <FileUploadButton memoryId={memory.id} />
          <DeleteMemoryButton memoryId={memory.id} bondId={params.id} />
        </div>

        <div className="grid md:grid-cols-3 mt-4 grid-cols-1 gap-2">
          {memory.pictures.map((picture) => (
            <PictureCard key={picture.id} picture={picture} />
          ))}
        </div>
      </div>
    </div>
  );
}
