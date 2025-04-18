import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";

export async function PATCH(
  req: Request,
  { params }: { params: { boardId: string } }
) {
  try {
    const { boardId } = params;
    const { title } = await req.json();
    const db = getDb();

    // Check if the board exists
    const board = await db.query.boards.findFirst({
      where: eq(schema.boards.id, boardId),
    });

    if (!board) {
      return new NextResponse("Board not found", { status: 404 });
    }

    // Update the board title
    const [updatedBoard] = await db.update(schema.boards)
      .set({ title })
      .where(eq(schema.boards.id, boardId))
      .returning();

    return NextResponse.json(updatedBoard);
  } catch (error) {
    console.error("BOARD_PATCH", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
