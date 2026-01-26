
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Loader2, Send, X } from "lucide-react";
import UserAvatar from "./UserAvatar";
import { useState } from "react";

interface SelectedChatProps{
  onClose: () => void;
}

const SelectedChat = ({onClose}: SelectedChatProps) => {
  const [demo, setDemo] = useState(false);
  return (
    <div className="flex flex-col w-full bg-background h-full z-60">
      <div className="h-14 sm:h-16 border-b border-border flex items-center gap-1.5 sm:gap-3 px-4 shrink-0">
        <UserAvatar />

        <div>
          <p className="text-sm font-medium">username</p>
          <p className="text-xs text-muted-foreground">Active now</p>
        </div>
        <button className="ml-auto hover:opacity-70 transition">
          <X
            onClick={onClose}
            className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground"
          />
        </button>
      </div>

      <div className="flex-1 text-xs sm:text-sm overflow-y-auto p-4 space-y-2.5 sm:space-y-5 bg-muted/30">
        <Card className="w-full sm:w-fit max-w-xs md:max-w-sm xl:max-w-md p-2.5  sm:p-3.5  wrap-break-word">
          Heydddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
          👋
        </Card>

        <Card className="max-w-xs p-2 ml-auto bg-secondary text-secondary-foreground wrap-break-word">
          Hi! What's
          up?ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        </Card>

        <Card className="max-w-xs p-2 ">Working on a new project 🚀</Card>
      </div>

      <div className="border-t border-border p-3 flex items-center gap-2 shrink-0">
        <Input
          placeholder="Message..."
          className="flex-1  text-xs sm:text-sm"
        />
        <button
          disabled={demo}
          className="
        p-2 rounded-md bg-primary text-primary-foreground
        hover:opacity-90
        disabled:opacity-50 disabled:cursor-not-allowed
        transition
      "
        >
          {demo ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default SelectedChat;
