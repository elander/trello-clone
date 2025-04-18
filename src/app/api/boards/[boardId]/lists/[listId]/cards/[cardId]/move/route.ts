import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { boardId: string; listId: string; cardId: string } }
) {
  try {
    const { listId, cardId } = params;
    const { destinationListId, position } = await req.json();

    // Verify the card exists and belongs to the source list
    const card = await db.card.findUnique({
      where: {
        id: cardId,
        listId,
      },
    });

    if (!card) {
      return new NextResponse("Card not found", { status: 404 });
    }

    // Verify the destination list exists
    const destinationList = await db.list.findUnique({
      where: {
        id: destinationListId,
      },
    });

    if (!destinationList) {
      return new NextResponse("Destination list not found", { status: 404 });
    }

    // Get all cards in the destination list
    const destinationCards = await db.card.findMany({
      where: {
        listId: destinationListId,
      },
      orderBy: {
        order: "asc",
      },
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
    await db.card.update({
      where: {
        id: cardId,
      },
      data: {
        listId: destinationListId,
        order: cardsToUpdate.find((c) => c.id === cardId)?.order || position,
      },
    });

    // Update the order of all cards in the destination list
    for (const card of cardsToUpdate) {
      if (card.id !== cardId) {
        await db.card.update({
          where: {
            id: card.id,
          },
          data: {
            order: card.order,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CARD_MOVE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
