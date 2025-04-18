"use client";

import { CardModal } from "@/components/modals/card-modal";
import { CardModalProvider } from "@/contexts/CardModalContext";

export function Providers() {
  return (
    <CardModalProvider>
      <CardModal />
    </CardModalProvider>
  );
}
