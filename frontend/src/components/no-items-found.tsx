import { Search, FileX, Plus } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

interface NoItemsFoundProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  showAction?: boolean;
}

export default function NoItemsFound({
  title = "No items found",
  description = "There are no items to display at the moment.",
  actionText = "Create new",
  actionHref = "#",
  showAction = false,
}: NoItemsFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-6">
        {/* Background circle with gradient */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 flex items-center justify-center">
          <FileX className="w-10 h-10 text-green-400" />
        </div>
        {/* Small search icon overlay */}
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gray-800 border border-green-500/30 flex items-center justify-center">
          <Search className="w-4 h-4 text-green-400" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-green-400 mb-2">{title}</h3>
      <p className="text-gray-400 text-center max-w-md mb-6">{description}</p>

      {showAction && (
        <Link href={actionHref}>
          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700 text-white border-green-500/30"
          >
            <Plus className="w-4 h-4 mr-2" />
            {actionText}
          </Button>
        </Link>
      )}
    </div>
  );
}
