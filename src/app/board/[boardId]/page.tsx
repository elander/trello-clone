import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { BoardHeader } from "@/components/board/board-header";
import { ListContainer } from "@/components/board/list-container";

interface BoardPageProps {
  params: {
    boardId: string;
  };
}

export default async function BoardPage({ params }: BoardPageProps) {
  const db = getDb();
  
  const board = await db.query.boards.findFirst({
    where: eq(schema.boards.id, params.boardId),
    with: {
      lists: {
        orderBy: (lists, { asc }) => [asc(lists.order)],
        with: {
          cards: {
            orderBy: (cards, { asc }) => [asc(cards.order)],
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
