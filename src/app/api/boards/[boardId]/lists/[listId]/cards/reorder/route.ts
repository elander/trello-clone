import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { boardId: string; listId: string } }
) {
  try {
    const { listId } = params;
    const { cards } = await req.json();

    // Verify the list exists
    const list = await db.list.findUnique({
      where: {
        id: listId,
      },
    });

    if (!list) {
      return new NextResponse("List not found", { status: 404 });
    }

    // Update the order of each card
    for (const card of cards) {
      await db.card.update({
        where: {
          id: card.id,
        },
        data: {
          order: card.order,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CARD_REORDER", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
