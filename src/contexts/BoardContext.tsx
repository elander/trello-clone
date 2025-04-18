"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

interface BoardContextProps {
  orderedLists: any[];
  setOrderedLists: React.Dispatch<React.SetStateAction<any[]>>;
  reorderLists: (startIndex: number, endIndex: number) => void;
  moveCard: (
    source: { droppableId: string; index: number },
    destination: { droppableId: string; index: number },
    cardId: string
  ) => void;
  reorderCards: (listId: string, startIndex: number, endIndex: number) => void;
}

const BoardContext = createContext<BoardContextProps | undefined>(undefined);

interface BoardProviderProps {
  children: ReactNode;
  initialLists: any[];
  boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const BoardProvider = ({ children, initialLists, boardId }: BoardProviderProps) => {
  const [orderedLists, setOrderedLists] = useState(initialLists);
  const router = useRouter();

  useEffect(() => {
    setOrderedLists(initialLists);
  }, [initialLists]);

  const reorderLists = async (startIndex: number, endIndex: number) => {
    const reorderedLists = reorder(orderedLists, startIndex, endIndex).map(
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
  };

  const reorderCards = async (listId: string, startIndex: number, endIndex: number) => {
    const newOrderedLists = [...orderedLists];
    const sourceList = newOrderedLists.find((list) => list.id === listId);

    if (!sourceList) return;
    if (!sourceList.cards) sourceList.cards = [];

    const reorderedCards = reorder(sourceList.cards, startIndex, endIndex);

    reorderedCards.forEach((card, idx) => {
      card.order = idx;
    });

    sourceList.cards = reorderedCards;
    setOrderedLists(newOrderedLists);

    try {
      await fetch(`/api/boards/${boardId}/lists/${listId}/cards/reorder`, {
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
  };

  const moveCard = async (
    source: { droppableId: string; index: number },
    destination: { droppableId: string; index: number },
    cardId: string
  ) => {
    const newOrderedLists = [...orderedLists];
    
    // Source and destination list
    const sourceList = newOrderedLists.find((list) => list.id === source.droppableId);
    const destList = newOrderedLists.find((list) => list.id === destination.droppableId);
    
    if (!sourceList || !destList) return;
    
    // Check if cards exist on the source list
    if (!sourceList.cards) sourceList.cards = [];
    
    // Check if cards exist on the destination list
    if (!destList.cards) destList.cards = [];
    
    // Moving the card in the same list
    if (source.droppableId === destination.droppableId) {
      reorderCards(source.droppableId, source.index, destination.index);
      return;
    }
    
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
      await fetch(`/api/boards/${boardId}/lists/${sourceList.id}/cards/${cardId}/move`, {
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
  };

  return (
    <BoardContext.Provider 
      value={{ 
        orderedLists, 
        setOrderedLists, 
        reorderLists, 
        reorderCards, 
        moveCard 
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  
  if (context === undefined) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  
  return context;
};
