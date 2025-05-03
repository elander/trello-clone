"use client";

import { ElementRef, useRef, useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";

import { cn } from "@/lib/utils";
import { ListHeader } from "./list-header";
import { CardForm } from "./card-form";
import { CardItem } from "./card-item";

interface ListItemProps {
  list: any;
  index: number;
  boardId: string;
}

export function ListItem({ list, index, boardId }: ListItemProps) {
  const textareaRef = useRef<ElementRef<"textarea">>(
  list.id === "todo" || list.id === "complete" ? null : null
  );
  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={cn(
            "h-full w-[272px] shrink-0 select-none",
            snapshot.isDragging && "dragging-list"
          )}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div
            className="w-full rounded-md bg-[#f8f9fa] dark:bg-slate-700 shadow-md pb-2"
          >
            <ListHeader 
              onAddCard={enableEditing}
              boardId={boardId}
              list={list}
              dragHandleProps={provided.dragHandleProps}
            />
            <Droppable droppableId={list.id} type="card">
              {(provided) => (
                <div
                  className="mx-1 px-1 py-0.5 flex flex-col gap-y-2 max-h-[calc(100vh-205px)] overflow-y-auto"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {list.cards?.map((card, index) => (
                    <CardItem
                      key={card.id}
                      index={index}
                      card={card}
                      listId={list.id}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <CardForm
              listId={list.id}
              boardId={boardId}
              ref={textareaRef}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
            />
          </div>
        </div>
      )}
    </Draggable>
  );
}
