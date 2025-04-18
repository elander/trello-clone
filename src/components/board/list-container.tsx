"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

import { ListItem } from "./list-item";
import { ListForm } from "./list-form";

import { useRouter } from "next/navigation";

interface ListContainerProps {
  board: any;
  boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export function ListContainer({ board, boardId }: ListContainerProps) {
  const [orderedLists, setOrderedLists] = useState(board.lists);
  const router = useRouter();

  useEffect(() => {
    setOrderedLists(board.lists);
  }, [board.lists]);

  const onDragEnd = async (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // If user moves a list
    if (type === "list") {
      const reorderedLists = reorder(orderedLists, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );

      setOrderedLists(reorderedLists);

      try {
        await fetch(`/api/boards/${boardId}/lists/reorder`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lists: reorderedLists,
          }),
        });
        router.refresh();
      } catch (error) {
        console.error(error);
      }
    }

    // If user moves a card
    if (type === "card") {
      let newOrderedLists = [...orderedLists];

      // Source and destination list
      const sourceList = newOrderedLists.find((list) => list.id === source.droppableId);
      const destList = newOrderedLists.find((list) => list.id === destination.droppableId);

      if (!sourceList || !destList) {
        return;
      }

      // Check if cards exist on the source list
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // Check if cards exist on the destination list
      if (!destList.cards) {
        destList.cards = [];
      }

      // Moving the card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(sourceList.cards, source.index, destination.index);

        reorderedCards.forEach((card, idx) => {
          card.order = idx;
        });

        sourceList.cards = reorderedCards;

        setOrderedLists(newOrderedLists);

        try {
          await fetch(`/api/boards/${boardId}/lists/${sourceList.id}/cards/reorder`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cards: reorderedCards,
            }),
          });
          router.refresh();
        } catch (error) {
          console.error(error);
        }
      } else {
        // Moving the card to another list
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        // Assign the new listId to the moved card
        movedCard.listId = destination.droppableId;

        // Add card to the destination list
        destList.cards.splice(destination.index, 0, movedCard);

        // Update the order for each card in the source list
        sourceList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        // Update the order for each card in the destination list
        destList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        setOrderedLists(newOrderedLists);

        try {
          await fetch(`/api/boards/${boardId}/lists/${sourceList.id}/cards/${movedCard.id}/move`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              destinationListId: destination.droppableId,
              position: destination.index,
            }),
          });
          router.refresh();
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <div 
            className="pt-16 h-full flex gap-3"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {orderedLists.map((list, index) => (
              <ListItem 
                key={list.id}
                index={index}
                list={list}
                boardId={boardId}
              />
            ))}
            {provided.placeholder}
            <ListForm boardId={boardId} />
            <div className="w-1 flex-shrink-0" />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
