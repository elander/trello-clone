import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { boardId: string } }
) {
  try {
    const { boardId } = params;
    const { lists } = await req.json();

    // Verify the board exists
    const board = await db.board.findUnique({
      where: {
        id: boardId,
      },
    });

    if (!board) {
      return new NextResponse("Board not found", { status: 404 });
    }

    // Update the order of each list
    for (const list of lists) {
      await db.list.update({
        where: {
          id: list.id,
        },
        data: {
          order: list.order,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("LIST_REORDER", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
