import { X } from "lucide-react";
import { Input } from "../ui/input";

import UserAvatar from "../UserAvatar";
import { useState } from "react";
import { useSearchUsersQuery } from "../../services/userApi";
import type { SearchUser } from "../../types/user.types";
import { ScrollArea } from "../ui/scroll-area";

interface NewMessageModalProps {
  onClose: () => void;
  onStartChat: (users: SearchUser[]) => void;
  startChat: () => void;
}

const NewMessageModal = ({ onClose, onStartChat , startChat}: NewMessageModalProps) => {
    const [searchTerm, setSearchTerm] = useState("");
 const [selectedUsers, setSelectedUsers] = useState<SearchUser[]>([]);
    const { data: searchData} = useSearchUsersQuery(searchTerm, {
      skip: !searchTerm.trim()
    })
 
    const users = searchData?.users;

    const toggleUser = (user: SearchUser) => {
      setSelectedUsers((prev) => {
        const exists = prev.some((u) => u._id === user._id);
        if (exists) {
          return prev.filter((u) => u._id !== user._id);
        }
        return [...prev, user];
      });
    };


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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
          border-0 focus-visible:ring-0
          h-7 sm:h-8
          text-xs sm:text-sm
        "
          />
        </div>

        {/* Suggested */}
        <div className="px-3 sm:px-4 py-3">
          <p className="text-xs font-semibold text-muted-foreground mb-3">
            Suggested
          </p>

        {users?.map((user: SearchUser) => {
  const isSelected = selectedUsers.some(
    (u) => u._id === user._id
  );

  return (
    <div
      key={user._id}
      onClick={() => toggleUser(user)}  
      className="
        flex items-center justify-between
        px-2 py-2
        rounded-md
        hover:bg-muted/40
        active:bg-muted/40
        transition-colors
        duration-100
        cursor-pointer
      "
    >
      <div className="flex items-center gap-3">
        <UserAvatar user={user} />

        <div>
          <p className="text-sm font-medium">{user.userName}</p>
          <p className="text-xs text-muted-foreground">
            {user.fullName}
          </p>
        </div>
      </div>

      {/* ✅ Circle selector */}
      <div
        className={`
          h-4 w-4 rounded-full
          border flex items-center justify-center
          transition-all duration-150
          ${
            isSelected
              ? "border-primary bg-primary"
              : "border-muted-foreground bg-transparent"
          }
        `}
      >
        {isSelected && (
          <div className="h-1.5 w-1.5 rounded-full bg-background" />
        )}
      </div>
    </div>
  );
})}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4">
          <button
            disabled={selectedUsers.length === 0}
            onClick={() => {
              onStartChat(selectedUsers);
              startChat();
              onClose();
            }}
            className={`
    w-full py-2.5 rounded-lg text-sm font-medium
    ${
      selectedUsers.length === 0
        ? "bg-muted text-muted-foreground"
        : "bg-primary text-primary-foreground"
    }
  `}
          >
            Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewMessageModal;