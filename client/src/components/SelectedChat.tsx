
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Loader2, Send, X } from "lucide-react";
import UserAvatar from "./UserAvatar";
import { useState } from "react";
import type { SearchUser } from "../types/user.types";
import { useCreateMessageMutation, useGetAllMessagesQuery } from "../services/conversationApi";
import { useGetAuthUserQuery } from "../services/userApi";

interface SelectedChatProps{
  onClose: () => void;
  user: SearchUser;
}

const SelectedChat = ({onClose, user}: SelectedChatProps) => {
 
  const [text, setText] = useState<string>("");
  const [createMessage, {isLoading: isCreateMessageLoading}] = useCreateMessageMutation();
  const {isLoading: isMessagesLoading, data: messagesData} = useGetAllMessagesQuery(user._id);
  const messages = messagesData?.messages?? [];
 
  const {data: authData} = useGetAuthUserQuery();
  const authUserId = authData?.user?._id;



  const handleInput = async() => {
      const formData = new FormData();

      if(text.trim()){
        formData.append("text", text);
      }

      // if(media?.length ){
      //   media.forEach((file) => {
      //     formData.append("media", file);
      //   })
      // }

      const data = await createMessage({
        receiverId: user._id,
        formData
      }).unwrap();
     
      setText("")
  }


  return (
    <div className="flex flex-col w-full bg-background h-full z-60">
      <div className="h-14 sm:h-16 border-b border-border flex items-center gap-1.5 sm:gap-3 px-4 shrink-0">
        <UserAvatar user={user} />

        <div>
          <p className="text-sm font-medium">{user.userName}</p>
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
        {isMessagesLoading? <>loading..</> :  messages.map((message) => {
          const isSender = message.senderId._id === authUserId;

          return (
            <Card
              key={message._id}
              className={
              `  max-w-xs md:max-w-sm xl:max-w-md p-2.5 text-sm wrap-break-word
               ${ isSender
                  ? "ml-auto bg-secondary text-secondary-foreground"
                  : "bg-background" }
              `}
            >
              {message.text && message.text}

            </Card>
          );
        })}
      </div>

      <div className="border-t border-border p-3 flex items-center gap-2 shrink-0">
        <Input
          placeholder="Message..."
          className="flex-1  text-xs sm:text-sm"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={handleInput}
          disabled={isCreateMessageLoading}
          className="
        p-2 rounded-md bg-primary text-primary-foreground
        hover:opacity-90
        disabled:opacity-50 disabled:cursor-not-allowed
        transition
      "
        >
          {isCreateMessageLoading ? (
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
