"use client";

import { Draggable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useCardModal } from "@/hooks/use-card-modal";

interface CardItemProps {
  index: number;
  card: any;
  listId: string;
}

export function CardItem({ index, card, listId }: CardItemProps) {
  const cardModal = useCardModal();

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "truncate py-2 px-3 text-sm bg-white dark:bg-slate-700 rounded-md shadow-sm border-2 border-transparent",
            snapshot.isDragging && "dragging-card"
          )}
          onClick={() => cardModal.onOpen(card, listId)}
        >
          {card.title}
        </div>
      )}
    </Draggable>
  );
}
