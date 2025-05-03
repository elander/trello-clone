"use client";

import { CardModal } from "@/components/modals/card-modal";
import { CardModalProvider } from "@/contexts/CardModalContext";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <CardModalProvider>
      {children}
      <CardModal />
    </CardModalProvider>
  );
}
