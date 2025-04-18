"use client";

import { useState, useRef, ElementRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ListHeaderProps {
  boardId: string;
  list: any;
  onAddCard: () => void;
  dragHandleProps: any;
}

export function ListHeader({
  boardId,
  list,
  onAddCard,
  dragHandleProps,
}: ListHeaderProps) {
  const router = useRouter();
  const [title, setTitle] = useState(list.title);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<ElementRef<"input">>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const onBlur = async () => {
    disableEditing();

    if (title === list.title) return;
    if (title.trim() === "") {
      setTitle(list.title);
      return;
    }

    try {
      const response = await fetch(`/api/boards/${boardId}/lists/${list.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        setTitle(list.title);
        toast.error("Failed to update list title");
      } else {
        toast.success("List title updated");
        router.refresh();
      }
    } catch (error) {
      setTitle(list.title);
      toast.error("Something went wrong");
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setTitle(list.title);
      disableEditing();
    } else if (e.key === "Enter") {
      inputRef.current?.blur();
    }
  };

  const onDelete = async () => {
    try {
      const response = await fetch(`/api/boards/${boardId}/lists/${list.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("List deleted");
        router.refresh();
      } else {
        toast.error("Failed to delete list");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleCopyList = async () => {
    try {
      const response = await fetch(`/api/boards/${boardId}/lists/${list.id}/copy`, {
        method: "POST",
      });

      if (response.ok) {
        toast.success("List copied");
        router.refresh();
      } else {
        toast.error("Failed to copy list");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex justify-between items-start py-2 px-2 text-sm font-semibold">
      <div className="w-full" {...dragHandleProps}>
        {isEditing ? (
          <input
            ref={inputRef}
            value={title}
            onChange={onTitleChange}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            className="w-full px-2 py-1 text-sm font-medium border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <button
            onClick={enableEditing}
            className="w-full px-2 py-1 text-sm font-medium text-left hover:bg-white/50 dark:hover:bg-slate-700/50 rounded"
          >
            {list.title}
          </button>
        )}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="h-auto w-auto p-1" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="px-0 pt-3 pb-0" side="bottom" align="end">
          <div className="text-sm font-medium text-center text-neutral-600 dark:text-neutral-300 pb-3">
            List actions
          </div>
          <div className="flex flex-col">
            <PopoverClose asChild>
              <Button
                onClick={onAddCard}
                className="w-full h-auto p-2 px-5 justify-start font-normal text-sm rounded-none hover:bg-slate-100 dark:hover:bg-slate-700"
                variant="ghost"
              >
                Add card...
              </Button>
            </PopoverClose>
            <PopoverClose asChild>
              <Button
                onClick={handleCopyList}
                className="w-full h-auto p-2 px-5 justify-start font-normal text-sm rounded-none hover:bg-slate-100 dark:hover:bg-slate-700"
                variant="ghost"
              >
                Copy list...
              </Button>
            </PopoverClose>
            <PopoverClose asChild>
              <Button
                onClick={onDelete}
                className="w-full h-auto p-2 px-5 justify-start font-normal text-sm rounded-none text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                variant="ghost"
              >
                Delete this list
              </Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
