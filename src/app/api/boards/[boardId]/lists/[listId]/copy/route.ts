import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { boardId: string; listId: string } }
) {
  try {
    const { boardId, listId } = params;

    // Get the list to copy
    const listToCopy = await db.list.findUnique({
      where: {
        id: listId,
        boardId,
      },
      include: {
        cards: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!listToCopy) {
      return new NextResponse("List not found", { status: 404 });
    }

    // Get all lists to determine the new order
    const lists = await db.list.findMany({
      where: {
        boardId,
      },
      orderBy: {
        order: "desc",
      },
      take: 1,
    });

    const order = lists.length > 0 ? lists[0].order + 1 : 0;

    // Create a new list with the same title
    const newList = await db.list.create({
      data: {
        title: `${listToCopy.title} (Copy)`,
        order,
        boardId,
      },
    });

    // Copy all cards to the new list
    if (listToCopy.cards.length > 0) {
      await db.card.createMany({
        data: listToCopy.cards.map((card, index) => ({
          title: card.title,
          description: card.description,
          order: card.order,
          listId: newList.id,
          dueDate: card.dueDate,
        })),
      });
    }

    return NextResponse.json(newList, { status: 201 });
  } catch (error) {
    console.error("LIST_COPY", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
