import { Input } from "../components/ui/input";

import { Search, SquarePen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SelectedChat from "../components/SelectedChat";
import NoChatSelected from "../components/NoChatSelected";
import UserAvatar from "../components/UserAvatar";
import NewMessageModal from "../components/modals/NewMessageModal";
import type { SearchUser } from "../types/user.types";
import {
  conversationApi,
  useGetLastMessagesQuery,
} from "../services/conversationApi";
import ChatListSkeleton from "../components/Skeletons/ChatListSkeleton";
import { useAppSelector } from "../utils/hooks";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { useGetAuthUserQuery } from "../services/userApi";
import { getSocket } from "../utils/socket";

const MessagePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isChatSelected, setIsChatSelected] = useState(false);
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] =
    useState<boolean>(false);

  const { isLoading: isLastChatsLoading, data: lastChatData } =
    useGetLastMessagesQuery(undefined);
  const [search, setSearch] = useState("");
  const [activeChatUser, setActiveChatUser] = useState<SearchUser | null>(null);

  const conversations = lastChatData?.conversations;

  const { onlineUsers } = useAppSelector((state) => state.socket);
  const { data: authData } = useGetAuthUserQuery();
  const authUserId = authData?.user?._id;
  const ONLINE_THRESHOLD = 2 * 60 * 1000; // 2 minutes

  const isUserOnline = (userId: string) => {
    const lastActive = onlineUsers[userId];
    if (!lastActive) return false;
    return Date.now() - lastActive < ONLINE_THRESHOLD;
  };

  const getUserStatus = (userId: string) => {
    const lastActive = onlineUsers[userId];
    if (!lastActive) return "Offline";

    const diff = Date.now() - lastActive;

    if (diff < ONLINE_THRESHOLD) return "Active now";
    if (diff < 60 * 60 * 1000)
      return `Last active ${Math.floor(diff / 60000)} mins ago`;

    return `Last active ${Math.floor(diff / 3600000)} hrs ago`;
  };

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !authUserId) return;

    const handleNewMessage = (message: any) => {
      const senderId = message.senderId._id;
      const receiverId = message.receiverId._id;

      const otherUserId = senderId === authUserId ? receiverId : senderId;

      dispatch(
        conversationApi.util.updateQueryData(
          "getLastMessages",
          undefined,
          (draft: any) => {
            if (!draft?.conversations) return;

            const index = draft.conversations.findIndex(
              (c: any) => c.receiver._id === otherUserId,
            );

            if (index !== -1) {
              draft.conversations[index].lastMessage = message;

              // Move chat to top
              const [conv] = draft.conversations.splice(index, 1);
              draft.conversations.unshift(conv);
            } else {
              // New chat
              draft.conversations.unshift({
                _id: message._id,
                receiver:
                  senderId === authUserId
                    ? message.receiverId
                    : message.senderId,
                lastMessage: message,
              });
            }
          },
        ),
      );
    };

    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [authUserId, dispatch]);

  const filteredConversations = useMemo(() => {
    if (!conversations) return [];

    if (!search.trim()) return conversations;

    return conversations.filter((conv: any) =>
      conv.receiver.userName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, conversations]);

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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="pl-9 py-2 bg-muted text-sm md:text-base"
            />
          </div>

          <h2 className="text-base md:text-lg font-semibold">Messages</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLastChatsLoading ? (
            <ChatListSkeleton />
          ) : filteredConversations.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No conversations found
            </div>
          ) : (
            filteredConversations.map((chat: any) => (
              <div
                key={chat._id}
                onClick={() => {
                  setActiveChatUser(chat.receiver);
                  setIsChatSelected(true);
                }}
                className="flex items-center gap-3 px-4 py-1.5 md:py-3 cursor-pointer hover:bg-muted/60 active:bg-muted/60"
              >
                <div className="relative">
                  <UserAvatar
                    user={chat.receiver}
                    classes="h-9 w-9 md:h-10 md:w-10"
                  />
                  <span
                    className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background
            ${isUserOnline(chat.receiver._id) ? "bg-green-500" : "bg-red-500"}
          `}
                  />
                </div>

                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium">
                    {chat.receiver?.userName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {chat.lastMessage?.text?.trim()
                      ? chat.lastMessage.text
                      : chat.lastMessage?.media?.length
                        ? "📎 Attachment"
                        : "No messages yet"}
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
            isOnline={isUserOnline(activeChatUser._id)}
            statusText={getUserStatus(activeChatUser._id)}
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
