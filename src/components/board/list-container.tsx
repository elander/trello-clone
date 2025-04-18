"use client";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";

import { ListItem } from "./list-item";
import { ListForm } from "./list-form";
import { BoardProvider, useBoard } from "@/contexts/BoardContext";

interface ListContainerProps {
  board: any;
  boardId: string;
}

export function ListContainer({ board, boardId }: ListContainerProps) {
  return (
    <BoardProvider initialLists={board.lists} boardId={boardId}>
      <ListContainerContent boardId={boardId} />
    </BoardProvider>
  );
}

function ListContainerContent({ boardId }: { boardId: string }) {
  const { orderedLists, reorderLists, reorderCards, moveCard } = useBoard();

  const onDragEnd = async (result: any) => {
    const { destination, source, type, draggableId } = result;

    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // If user moves a list
    if (type === "list") {
      reorderLists(source.index, destination.index);
      return;
    }

    // If user moves a card
    if (type === "card") {
      if (source.droppableId === destination.droppableId) {
        // Reordering within the same list
        reorderCards(source.droppableId, source.index, destination.index);
      } else {
        // Moving to another list
        moveCard(source, destination, draggableId);
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
