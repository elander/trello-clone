"use client";

import { useRef, ElementRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X, Trash2, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

import { useCardModal } from "@/contexts/CardModalContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function CardModal() {
  const router = useRouter();
  const closeRef = useRef<ElementRef<"button">>(null);
  const { isOpen, onClose, card, listId } = useCardModal();

  const onDelete = async () => {
    if (!card) return;

    try {
      const response = await fetch(`/api/cards/${card.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Card deleted");
        onClose();
        router.refresh();
      } else {
        toast.error("Failed to delete card");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!card) return;

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const dueDate = formData.get("dueDate") as string;

    try {
      const response = await fetch(`/api/cards/${card.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, dueDate }),
      });

      if (response.ok) {
        toast.success("Card updated");
        onClose();
        router.refresh();
      } else {
        toast.error("Failed to update card");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (!card) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <button
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800"
          onClick={onClose}
          ref={closeRef}
        >
          <X className="h-5 w-5" />
        </button>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input
              name="title"
              defaultValue={card.title || ""}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              defaultValue={card.description || ""}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
              placeholder="Add a more detailed description..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-x-2">
              <Calendar className="h-4 w-4" />
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              defaultValue={card.dueDate ? new Date(card.dueDate).toISOString().split("T")[0] : ""}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-x-2 justify-end pt-4">
            <Button
              type="button"
              onClick={onDelete}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button type="submit" size="sm">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
