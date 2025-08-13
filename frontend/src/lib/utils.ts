import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getLevelColor = (level: string) => {
  switch (level) {
    case "Easy":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "Medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "Hard":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

export const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "LEGENDARY":
      return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10";
    case "MYTHIC":
      return "text-red-400 border-red-400/30 bg-red-400/10";
    case "EPIC":
      return "text-purple-400 border-purple-400/30 bg-purple-400/10";
    default:
      return "text-green-400 border-green-400/30 bg-green-400/10";
  }
};
