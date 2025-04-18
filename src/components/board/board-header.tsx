"use client";

import { Board } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface BoardHeaderProps {
  board: Board;
}

export function BoardHeader({ board }: BoardHeaderProps) {
  const [title, setTitle] = useState(board.title);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const onBlur = async () => {
    if (title === board.title) {
      setIsEditing(false);
      return;
    }

    try {
      const response = await fetch(`/api/boards/${board.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsEditing(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }

    if (e.key === "Escape") {
      setTitle(board.title);
      setIsEditing(false);
    }
  };

  return (
    <div className="w-full h-14 z-[40] bg-black/50 fixed top-0 left-0 flex items-center px-6 gap-x-4 text-white">
      {isEditing ? (
        <input
          className="bg-transparent focus-visible:outline-none font-bold text-xl px-2 py-1 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          autoFocus
        />
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="font-bold text-xl hover:underline"
        >
          {board.title}
        </button>
      )}
    </div>
  );
}
