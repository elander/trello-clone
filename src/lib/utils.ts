import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | number) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function generateRandomGradient() {
  const colors = [
    "bg-gradient-to-r from-pink-500 to-purple-500",
    "bg-gradient-to-r from-blue-500 to-teal-500",
    "bg-gradient-to-r from-green-500 to-lime-500",
    "bg-gradient-to-r from-yellow-500 to-orange-500",
    "bg-gradient-to-r from-purple-500 to-indigo-500",
    "bg-gradient-to-r from-red-500 to-pink-500",
    "bg-gradient-to-r from-indigo-500 to-blue-500",
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}
