import { create } from "zustand";

type CardModalStore = {
  id?: string;
  isOpen: boolean;
  card?: any;
  listId?: string;
  onOpen: (card: any, listId: string) => void;
  onClose: () => void;
};

export const useCardModal = create<CardModalStore>((set) => ({
  id: undefined,
  isOpen: false,
  card: undefined,
  listId: undefined,
  onOpen: (card, listId) => set({ isOpen: true, card, listId }),
  onClose: () => set({ isOpen: false, card: undefined, listId: undefined }),
}));
