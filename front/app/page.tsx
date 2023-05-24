import { api } from "@/lib/api";
import { cookies } from "next/headers";
import Image from "next/image";
import { EmptyMemory } from "./components/EmptyMemory";
import dayjs from "dayjs";
import ptBr from "dayjs/locale/pt-br";
import Link from "next/link";
dayjs.locale(ptBr);
interface Memory {
  id: string;
  coverUrl: string;
  createdAt: string;
  excerpt: string;
}

export default async function Home() {
  const isAuthenticated = cookies().has("token");
  if (!isAuthenticated) {
    return <EmptyMemory />;
  }
  const token = cookies().get("token")?.value;
  const response = await api.get("/memories", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const memories: Memory[] = response.data;
  console.log(memories);
  if (memories.length === 0) {
    return <EmptyMemory />;
  }
  return (
    <div className="flex flex-col gap-10 p-8">
      {memories.map((memory) => (
        <div className="space-y-4" key={memory.id}>
          <time className="-ml-8 flex items-center gap-2 text-sm text-gray-400 before:h-px before:w-5 before:bg-gray-300">
            {dayjs(memory.createdAt).format("D[ de] MM[, ]YYYY")}
          </time>
          <Image
            className="aspect-video w-full rounded-lg leading-relaxed"
            width={592}
            height={280}
            alt=""
            src={memory.coverUrl}
          />
          <p className="text-lg leading-relaxed text-gray-400">
            {memory.excerpt}
          </p>
          <Link
            href={`/memories/${memory.id}`}
            className="flex items-center gap-2 text-sm text-gray-200 hover:text-gray-100"
          >
            Ler mais
          </Link>
        </div>
      ))}
    </div>
  );
}
