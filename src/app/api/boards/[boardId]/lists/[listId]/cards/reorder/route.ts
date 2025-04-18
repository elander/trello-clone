import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";

export async function PUT(
  req: Request,
  { params }: { params: { boardId: string; listId: string } }
) {
  try {
    const { listId } = params;
    const { cards } = await req.json();
    const db = getDb();

    // Verify the list exists
    const list = await db.query.lists.findFirst({
      where: eq(schema.lists.id, listId),
    });

    if (!list) {
      return new NextResponse("List not found", { status: 404 });
    }

    // Update the order of each card
    for (const card of cards) {
      await db.update(schema.cards)
        .set({ order: card.order })
        .where(eq(schema.cards.id, card.id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CARD_REORDER", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
