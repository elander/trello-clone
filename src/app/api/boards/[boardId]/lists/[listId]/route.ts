import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { getDb, schema } from "@/db";

export async function PATCH(
  req: Request,
  { params }: { params: { boardId: string; listId: string } }
) {
  try {
    const { boardId, listId } = params;
    const { title } = await req.json();
    const db = getDb();

    // Check if the list exists and belongs to the board
    const list = await db.query.lists.findFirst({
      where: and(
        eq(schema.lists.id, listId),
        eq(schema.lists.boardId, boardId)
      ),
    });

    if (!list) {
      return new NextResponse("List not found", { status: 404 });
    }

    // Update the list title
    const [updatedList] = await db.update(schema.lists)
      .set({ title })
      .where(eq(schema.lists.id, listId))
      .returning();

    return NextResponse.json(updatedList);
  } catch (error) {
    console.error("LIST_PATCH", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { boardId: string; listId: string } }
) {
  try {
    const { boardId, listId } = params;
    const db = getDb();

    // Check if the list exists and belongs to the board
    const list = await db.query.lists.findFirst({
      where: and(
        eq(schema.lists.id, listId),
        eq(schema.lists.boardId, boardId)
      ),
    });

    if (!list) {
      return new NextResponse("List not found", { status: 404 });
    }

    // Get all lists to reorder them after deletion
    const lists = await db.query.lists.findMany({
      where: eq(schema.lists.boardId, boardId),
      orderBy: (lists, { asc }) => [asc(lists.order)],
    });

    // Delete the list
    await db.delete(schema.lists).where(eq(schema.lists.id, listId));

    // Reorder remaining lists
    const reorderedLists = lists
      .filter((l) => l.id !== listId)
      .map((list, index) => ({
        ...list,
        order: index,
      }));

    // Update the order of remaining lists
    for (const list of reorderedLists) {
      await db.update(schema.lists)
        .set({ order: list.order })
        .where(eq(schema.lists.id, list.id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("LIST_DELETE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
