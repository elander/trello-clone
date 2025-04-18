"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Card } from "@/db/schema";

interface CardModalContextProps {
  isOpen: boolean;
  card?: Partial<Card>;
  listId?: string;
  onOpen: (card: Partial<Card>, listId: string) => void;
  onClose: () => void;
}

const CardModalContext = createContext<CardModalContextProps | undefined>(undefined);

export const CardModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [card, setCard] = useState<Partial<Card> | undefined>(undefined);
  const [listId, setListId] = useState<string | undefined>(undefined);

  const onOpen = (card: Partial<Card>, listId: string) => {
    setCard(card);
    setListId(listId);
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setCard(undefined);
    setListId(undefined);
  };

  return (
    <CardModalContext.Provider value={{ isOpen, card, listId, onOpen, onClose }}>
      {children}
    </CardModalContext.Provider>
  );
};

export const useCardModal = () => {
  const context = useContext(CardModalContext);
  
  if (context === undefined) {
    throw new Error("useCardModal must be used within a CardModalProvider");
  }
  
  return context;
};
