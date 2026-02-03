import { Input } from "../components/ui/input";

import { Search, SquarePen } from "lucide-react";
import { useState } from "react";
import SelectedChat from "../components/SelectedChat";
import NoChatSelected from "../components/NoChatSelected";
import UserAvatar from "../components/UserAvatar";
import NewMessageModal from "../components/modals/NewMessageModal";
import type { SearchUser } from "../types/user.types";
import { useGetLastMessagesQuery } from "../services/conversationApi";
import ChatListSkeleton from "../components/Skeletons/ChatListSkeleton";



const MessagePage = () => {
  const [isChatSelected, setIsChatSelected] = useState(false);
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] =
    useState<boolean>(false);
  
  const { isLoading: isLastChatsLoading, data: lastChatData } =
    useGetLastMessagesQuery(undefined);
  const [activeChatUser, setActiveChatUser] = useState<SearchUser | null>(null);
  console.log("data side", lastChatData);
  const conversations = lastChatData?.conversations;
  const [demo, setDemo] = useState(false);
 
 

 

  return (
    <div className="h-screen w-full  text-foreground flex">
      {/* Sidebar */}
      <aside
        className={`w-full ${isChatSelected ? "hidden sm:flex" : "flex"} sm:w-[35%] md:w-[40%] lg:w-sm border-r border-border  flex-col`}
      >
        <div className="px-4 pt-6 pb-2 border-b border-border shrink-0">
          <h1 className="text-lg md:text-xl px-4 mb-2 flex justify-between font-semibold tracking-tight">
            Username
            <SquarePen
              onClick={() => setIsNewMessageModalOpen(true)}
              className="cursor-pointer hover:text-primary/60 active:text-primary/60 h-5 w-5 md:h-6 md:w-6 transition-colors"
            />
          </h1>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-9 py-2 bg-muted text-sm md:text-base"
            />
          </div>

          <h2 className="text-base md:text-lg font-semibold">Messages</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLastChatsLoading ? (
            <ChatListSkeleton />
          ) : (
            conversations.map((chat) => (
              <div
                key={chat._id}
                onClick={() => {
                  setActiveChatUser(chat.receiver);
                  setIsChatSelected(true);
                }}
                className="  flex items-center gap-3 px-4 py-1.5 md:py-3 cursor-pointer hover:bg-muted/60 active:bg-muted/60"
              >
                <div className="relative">
                  <UserAvatar
                    user={chat.receiver}
                    classes="h-9 w-9 md:h-10 md:w-10"
                  />
                  {/* <span
                    className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background
      ${isUserOnline(chat.receiver._id) ? "bg-green-500" : "bg-red-500"}
    `}
                  /> */}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {chat.receiver?.userName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {chat.lastMessage?.text || "No messages yet"}
                  </p>
                </div>
              </div>
            ))
          )}
          {/* {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((chat) => (
            <div
              key={chat}
              onClick={() => setIsChatSelected(true)}
              className=" flex items-center gap-3 px-4 py-1.5 md:py-3 cursor-pointer hover:bg-muted/60 active:bg-muted/60"
            >
              <UserAvatar classes="h-9 w-9 md:h-10 md:w-10" />

              <div className="flex-1">
                <p className="text-sm font-medium">username_{chat}</p>
                <p className="text-xs text-muted-foreground truncate">
                  Last message preview goes here...
                </p>
              </div>
            </div>
          ))} */}
        </div>
      </aside>

      {isNewMessageModalOpen && (
        <NewMessageModal
          startChat={() => setIsChatSelected(true)}
          onStartChat={(selectedUsers) => {
            if (selectedUsers.length === 1) {
              setActiveChatUser(selectedUsers[0]);
            }
            // (later: handle group chat here)
            setIsNewMessageModalOpen(false);
          }}
          onClose={() => {
            setIsNewMessageModalOpen(false);
          }}
        />
      )}

      {/* Chat Area */}
      <main
        className={`${isChatSelected ? "flex" : "hidden sm:flex "}    w-full sm:flex-1  flex-col`}
      >
        {activeChatUser ? (
          <SelectedChat
            user={activeChatUser}
            onClose={() => {
              setIsChatSelected(false);
              setActiveChatUser(null);
            }}
          />
        ) : (
          <NoChatSelected />
        )}
      </main>
    </div>
  );
};

export default MessagePage;
