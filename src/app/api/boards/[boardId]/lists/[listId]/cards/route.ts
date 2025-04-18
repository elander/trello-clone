import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";

export async function POST(
  req: Request,
  { params }: { params: { boardId: string; listId: string } }
) {
  try {
    const { listId } = params;
    const { title } = await req.json();
    const db = getDb();

    // Verify the list exists
    const list = await db.query.lists.findFirst({
      where: eq(schema.lists.id, listId),
      with: {
        cards: {
          orderBy: (cards, { desc }) => [desc(cards.order)],
          limit: 1,
        },
      },
    });

    if (!list) {
      return new NextResponse("List not found", { status: 404 });
    }

    // Calculate the order for the new card
    const order = list.cards && list.cards.length > 0 ? list.cards[0].order + 1 : 0;

    // Create the card
    const [card] = await db.insert(schema.cards)
      .values({
        title,
        order,
        listId,
      })
      .returning();

    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    console.error("CARD_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
