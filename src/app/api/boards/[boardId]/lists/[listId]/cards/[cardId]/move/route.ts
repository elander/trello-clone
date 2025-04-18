import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { getDb, schema } from "@/db";

export async function PUT(
  req: Request,
  { params }: { params: { boardId: string; listId: string; cardId: string } }
) {
  try {
    const { listId, cardId } = params;
    const { destinationListId, position } = await req.json();
    const db = getDb();

    // Verify the card exists and belongs to the source list
    const card = await db.query.cards.findFirst({
      where: and(
        eq(schema.cards.id, cardId),
        eq(schema.cards.listId, listId)
      ),
    });

    if (!card) {
      return new NextResponse("Card not found", { status: 404 });
    }

    // Verify the destination list exists
    const destinationList = await db.query.lists.findFirst({
      where: eq(schema.lists.id, destinationListId),
    });

    if (!destinationList) {
      return new NextResponse("Destination list not found", { status: 404 });
    }

    // Get all cards in the destination list
    const destinationCards = await db.query.cards.findMany({
      where: eq(schema.cards.listId, destinationListId),
      orderBy: (cards, { asc }) => [asc(cards.order)],
    });

    // Insert card at position and shift others
    let updatedCards = [...destinationCards];
    if (listId !== destinationListId) {
      // If moving to a different list, remove card from this list's calculation
      updatedCards = updatedCards.filter((c) => c.id !== cardId);
    }

    // Insert at position
    updatedCards.splice(position, 0, { ...card, listId: destinationListId });

    // Update orders
    const cardsToUpdate = updatedCards.map((card, index) => ({
      id: card.id,
      order: index,
    }));

    // Update the card's list ID and order
    await db.update(schema.cards)
      .set({
        listId: destinationListId,
        order: cardsToUpdate.find((c) => c.id === cardId)?.order || position,
      })
      .where(eq(schema.cards.id, cardId));

    // Update the order of all cards in the destination list
    for (const card of cardsToUpdate) {
      if (card.id !== cardId) {
        await db.update(schema.cards)
          .set({ order: card.order })
          .where(eq(schema.cards.id, card.id));
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CARD_MOVE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
