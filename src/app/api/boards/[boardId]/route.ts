import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { boardId: string } }
) {
  try {
    const { boardId } = params;
    const { title } = await req.json();

    // Check if the board exists
    const board = await db.board.findUnique({
      where: {
        id: boardId,
      },
    });

    if (!board) {
      return new NextResponse("Board not found", { status: 404 });
    }

    // Update the board title
    const updatedBoard = await db.board.update({
      where: {
        id: boardId,
      },
      data: {
        title,
      },
    });

    return NextResponse.json(updatedBoard);
  } catch (error) {
    console.error("BOARD_PATCH", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
