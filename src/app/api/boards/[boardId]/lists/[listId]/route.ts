import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { boardId: string; listId: string } }
) {
  try {
    const { boardId, listId } = params;
    const { title } = await req.json();

    // Check if the list exists and belongs to the board
    const list = await db.list.findUnique({
      where: {
        id: listId,
        boardId,
      },
    });

    if (!list) {
      return new NextResponse("List not found", { status: 404 });
    }

    // Update the list title
    const updatedList = await db.list.update({
      where: {
        id: listId,
      },
      data: {
        title,
      },
    });

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

    // Check if the list exists and belongs to the board
    const list = await db.list.findUnique({
      where: {
        id: listId,
        boardId,
      },
    });

    if (!list) {
      return new NextResponse("List not found", { status: 404 });
    }

    // Get all lists to reorder them after deletion
    const lists = await db.list.findMany({
      where: {
        boardId,
      },
      orderBy: {
        order: "asc",
      },
    });

    // Delete the list
    await db.list.delete({
      where: {
        id: listId,
      },
    });

    // Reorder remaining lists
    const reorderedLists = lists
      .filter((l) => l.id !== listId)
      .map((list, index) => ({
        ...list,
        order: index,
      }));

    // Update the order of remaining lists
    for (const list of reorderedLists) {
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
    console.error("LIST_DELETE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
