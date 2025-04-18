import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { boardId: string; listId: string } }
) {
  try {
    const { listId } = params;
    const { title } = await req.json();

    // Verify the list exists
    const list = await db.list.findUnique({
      where: {
        id: listId,
      },
      include: {
        cards: {
          orderBy: {
            order: "desc",
          },
          take: 1,
        },
      },
    });

    if (!list) {
      return new NextResponse("List not found", { status: 404 });
    }

    // Calculate the order for the new card
    const order = list.cards.length > 0 ? list.cards[0].order + 1 : 0;

    // Create the card
    const card = await db.card.create({
      data: {
        title,
        order,
        listId,
      },
    });

    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    console.error("CARD_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
