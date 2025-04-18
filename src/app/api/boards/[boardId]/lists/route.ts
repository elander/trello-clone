import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";

export async function POST(
  req: Request,
  { params }: { params: { boardId: string } }
) {
  try {
    const { boardId } = params;
    const { title } = await req.json();
    const db = getDb();

    // Get the number of lists to determine the order
    const lists = await db.query.lists.findMany({
      where: eq(schema.lists.boardId, boardId),
      orderBy: (lists, { desc }) => [desc(lists.order)],
      limit: 1,
    });

    const order = lists.length > 0 ? lists[0].order + 1 : 0;

    // Create a new list
    const [list] = await db.insert(schema.lists)
      .values({
        title,
        order,
        boardId,
      })
      .returning();

    return NextResponse.json(list, { status: 201 });
  } catch (error) {
    console.error("LIST_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
