import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function Home() {
  // Fetch the first board, or create one if none exists
  const boards = await db.board.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });

  if (boards.length === 0) {
    // Create a default board if none exists
    const newBoard = await db.board.create({
      data: {
        title: "My First Board",
        lists: {
          create: [
            {
              title: "To Do",
              order: 0,
            },
            {
              title: "In Progress",
              order: 1,
            },
            {
              title: "Done",
              order: 2,
            },
          ],
        },
      },
    });

    return redirect(`/board/${newBoard.id}`);
  }

  // Redirect to the first board
  return redirect(`/board/${boards[0].id}`);
}
