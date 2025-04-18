"use client";

import { forwardRef, useRef, ElementRef, KeyboardEventHandler } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { useOnClickOutside } from "usehooks-ts";

import { Button } from "@/components/ui/button";

interface CardFormProps {
  listId: string;
  boardId: string;
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  ({ listId, boardId, isEditing, enableEditing, disableEditing }, ref) => {
    const router = useRouter();
    const formRef = useRef<ElementRef<"form">>(null);

    useOnClickOutside(formRef, disableEditing);

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Escape") {
        disableEditing();
      }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      const title = formData.get("title") as string;

      if (title.trim() === "") {
        toast.error("Card title cannot be empty");
        return;
      }

      try {
        const response = await fetch(`/api/boards/${boardId}/lists/${listId}/cards`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title }),
        });

        if (response.ok) {
          toast.success("Card created");
          formRef.current?.reset();
          disableEditing();
          router.refresh();
        } else {
          toast.error("Failed to create card");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    };

    if (isEditing) {
      return (
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="m-1 p-3 space-y-4 bg-white dark:bg-slate-700 rounded-md shadow-sm"
        >
          <textarea
            ref={ref}
            name="title"
            onKeyDown={onKeyDown}
            className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Enter a title for this card..."
            required
          />
          <div className="flex items-center gap-x-1">
            <Button type="submit" size="sm" variant="primary">
              Add card
            </Button>
            <Button onClick={disableEditing} size="sm" variant="ghost">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </form>
      );
    }

    return (
      <div className="pt-2 px-2">
        <Button
          onClick={enableEditing}
          className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
          size="sm"
          variant="ghost"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a card
        </Button>
      </div>
    );
  }
);

CardForm.displayName = "CardForm";
