import { X } from "lucide-react";
import { Input } from "../ui/input";

import UserAvatar from "../UserAvatar";

interface NewMessageModalProps {
  onClose: () => void;
}

const NewMessageModal = ({ onClose }: NewMessageModalProps) => {

  return (
    <div
      onClick={onClose}
      className="fixed inset-0  z-63 flex items-center justify-center bg-black/40 px-3 sm:px-0"
    >
      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
      w-full sm:w-[90%] lg:w-[420px]
      max-w-md
      bg-background
      rounded-xl
      shadow-lg
      overflow-hidden
    "
      >
        {/* Header */}
        <div className="relative flex items-center justify-center py-3 sm:py-4 border-b">
          <h2 className="text-base sm:text-lg font-semibold">New message</h2>

          <button
            onClick={onClose}
            className="absolute right-3 sm:right-4 hover:opacity-70"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* To */}
        <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b">
          <span className="text-xs sm:text-sm font-medium">To:</span>
          <Input
            placeholder="Search..."
            className="
          border-0 focus-visible:ring-0
          h-7 sm:h-8
          text-xs sm:text-sm
        "
          />
        </div>

        {/* Suggested */}
        <div className="px-3 sm:px-4 py-3">
          <p className="text-xs font-semibold text-muted-foreground mb-2">
            Suggested
          </p>

          {/* User item */}
          <div
            className="
          flex items-center justify-between
          px-2 py-2
          rounded-md
          hover:bg-muted/40
          cursor-pointer
        "
          >
            <div className="flex items-center gap-3">
              <UserAvatar />

              <div>
                <p className="text-sm font-medium">zahilkutta1000</p>
                <p className="text-xs text-muted-foreground">zahilkutta1000</p>
              </div>
            </div>

            {/* Circle selector */}
            <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full border border-muted-foreground" />
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4">
          <button
            onClick={onClose}
            className="
          w-full py-2 sm:py-2.5
          rounded-lg
          bg-primary/30
          text-primary-foreground
          text-sm font-medium
        "
          >
            Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewMessageModal;