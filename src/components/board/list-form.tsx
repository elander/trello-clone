"use client";

import { useState, useRef, ElementRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

import { ListWrapper } from "./list-wrapper";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ListFormProps {
  boardId: string;
}

export function ListForm({ boardId }: ListFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const disableEditing = () => {
    setIsEditing(false);
    setTitle("");
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title.trim() === "") {
      toast.error("List title cannot be empty");
      return;
    }

    try {
      const response = await fetch(`/api/boards/${boardId}/lists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        toast.success("List created!");
        disableEditing();
        router.refresh();
      } else {
        toast.error("Failed to create list");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  if (isEditing) {
    return (
      <ListWrapper>
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="w-full p-3 space-y-4 rounded-md bg-white dark:bg-slate-800 shadow-md"
        >
          <input
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Enter list title..."
            className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center gap-x-1">
            <Button type="submit" size="sm">
              Add list
            </Button>
            <Button onClick={disableEditing} size="sm" variant="ghost">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <button
        onClick={enableEditing}
        className="w-full p-3 flex items-center font-medium text-sm rounded-md border-2 border-dashed hover:bg-white/80 dark:hover:bg-slate-800/80 hover:border-solid transition"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a list
      </button>
    </ListWrapper>
  );
}
