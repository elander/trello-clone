import { redirect } from "next/navigation";
import { getDb, schema } from "@/db";

export default async function Home() {
  const db = getDb();
  
  // Fetch the first board, or create one if none exists
  const boards = await db.query.boards.findMany({
    orderBy: (boards, { desc }) => [desc(boards.createdAt)],
    limit: 1,
  });

  if (boards.length === 0) {
    // Create a default board if none exists
    const [newBoard] = await db.insert(schema.boards).values({
      title: "My First Board",
    }).returning();
    
    // Create default lists
    await db.insert(schema.lists).values([
      {
        title: "To Do",
        order: 0,
        boardId: newBoard.id,
      },
      {
        title: "In Progress",
        order: 1,
        boardId: newBoard.id,
      },
      {
        title: "Done",
        order: 2,
        boardId: newBoard.id,
      },
    ]);

    return redirect(`/board/${newBoard.id}`);
  }

  // Redirect to the first board
  return redirect(`/board/${boards[0].id}`);
}
