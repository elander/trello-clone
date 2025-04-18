import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  try {
    const { cardId } = params;
    const { title, description, dueDate } = await req.json();

    // Verify the card exists
    const card = await db.card.findUnique({
      where: {
        id: cardId,
      },
    });

    if (!card) {
      return new NextResponse("Card not found", { status: 404 });
    }

    // Update the card
    const updatedCard = await db.card.update({
      where: {
        id: cardId,
      },
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error("CARD_PATCH", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  try {
    const { cardId } = params;

    // Verify the card exists
    const card = await db.card.findUnique({
      where: {
        id: cardId,
      },
    });

    if (!card) {
      return new NextResponse("Card not found", { status: 404 });
    }

    // Get all cards in the same list to reorder them after deletion
    const cards = await db.card.findMany({
      where: {
        listId: card.listId,
      },
      orderBy: {
        order: "asc",
      },
    });

    // Delete the card
    await db.card.delete({
      where: {
        id: cardId,
      },
    });

    // Reorder remaining cards
    const reorderedCards = cards
      .filter((c) => c.id !== cardId)
      .map((card, index) => ({
        ...card,
        order: index,
      }));

    // Update the order of remaining cards
    for (const card of reorderedCards) {
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
    console.error("CARD_DELETE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
