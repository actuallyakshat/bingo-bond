import { ChevronRight, Cloud, Users } from "lucide-react";
import Link from "next/link";

interface Bond {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  members: {
    id: string;
  }[];
  memories: {
    id: string;
  }[];
}

export function BondCard({ bond }: { bond: Bond }) {
  return (
    <Link
      href={`/bond/${bond.id}`}
      className="group relative overflow-hidden rounded-xl bg-gradient-to-b from-neutral-50 to-zinc-100 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white"
    >
      <div className="absolute inset-0 opacity-20 transition-opacity duration-300 group-hover:opacity-30" />
      <div className="relative p-6 flex flex-col h-full">
        <h3 className="text-xl font-bold mb-1">{bond.name}</h3>
        {bond.description && (
          <p className="text-sm text-muted-foreground dark mb-4 line-clamp-2">
            {bond.description}
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-center text-sm text-foreground/80 gap-4">
          {bond.members.length > 0 && (
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1 flex-shrink-0" />
              <span>
                {bond.members.length}{" "}
                {bond.members.length > 1 ? "Members" : "Member"}
              </span>
            </div>
          )}

          <div className="flex items-center">
            <Cloud className="w-4 h-4 mr-1 flex-shrink-0" />
            <span>{bond.memories.length} Memories</span>
          </div>

          {/*  */}
        </div>

        <div className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-md transform translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </div>
      </div>
    </Link>
  );
}
