import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { BoardHeader } from "@/components/board/board-header";
import { ListContainer } from "@/components/board/list-container";

interface BoardPageProps {
  params: {
    boardId: string;
  };
}

export default async function BoardPage({ params }: BoardPageProps) {
  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
    },
    include: {
      lists: {
        orderBy: {
          order: "asc",
        },
        include: {
          cards: {
            orderBy: {
              order: "asc",
            },
          },
        },
      },
    },
  });

  if (!board) {
    notFound();
  }

  return (
    <div className="h-full bg-slate-100 dark:bg-slate-900 overflow-x-auto p-4">
      <BoardHeader board={board} />
      <ListContainer board={board} boardId={params.boardId} />
    </div>
  );
}
