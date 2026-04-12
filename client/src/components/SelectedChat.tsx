import { Input } from "./ui/input";
import { useRef } from "react";
import { ImagePlus, Loader2, Send, X } from "lucide-react";
import UserAvatar from "./UserAvatar";
import { useEffect, useState } from "react";
import type { SearchUser } from "../types/user.types";
import {
  conversationApi,
  useCreateMessageMutation,
  useGetAllMessagesQuery,
} from "../services/conversationApi";

import toast from "react-hot-toast";
import MessageBubble from "./MessageBubble";
import { getSocket } from "../utils/socket";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import type { Message } from "../types/conversation.types";
import MessageSkeleton from "./Skeletons/MessageSkeleton";
import { useGetMeQuery } from "../services/authApi";

interface SelectedChatProps {
  onClose: () => void;
  user: SearchUser;
  isOnline: boolean;
  statusText: string;
}

type PreviewItem = {
  url: string;
  type: "image" | "video" | "audio" | "file";
  name: string;
};
const getPreviewType = (file: File): PreviewItem["type"] => {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  return "file";
};

const SelectedChat = ({
  onClose,
  user,
  statusText,
  isOnline,
}: SelectedChatProps) => {
  const [text, setText] = useState<string>("");
  const [media, setMedia] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [createMessage, { isLoading: isCreateMessageLoading }] =
    useCreateMessageMutation();
  const { isLoading: isMessagesLoading, data: messagesData } =
    useGetAllMessagesQuery(user._id);
  const messages = messagesData?.messages ?? [];

  const { data: authData } = useGetMeQuery(undefined);
  const authUserId = authData?.user?._id;
  const MAX_MEDIA_FILES = 5;
  const [previews, setPreviews] = useState<PreviewItem[]>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !user?._id || !authUserId) return;

    const handleNewMessage = (message: any) => {
    
      const senderId = message.senderId._id;
      const receiverId = message.receiverId._id;
      const isBetweenTheseUsers =
        (senderId === authUserId && receiverId === user._id) ||
        (senderId === user._id && receiverId === authUserId);
      if (!isBetweenTheseUsers) return;

      // 🔥 Update RTK Query cache
      dispatch(
        conversationApi.util.updateQueryData(
          "getAllMessages",
          user._id,
          (draft: any) => {
            if (!draft.messages.some((m: any) => m._id === message._id)) {
              draft.messages.push(message);
            }
          },
        ),
      );
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [user._id, authUserId]);

  const handleInput = async () => {
    try {
      const formData = new FormData();

      if (!text.trim() && media.length === 0) {
        return toast.error("Message cannot be empty");
      }

      if (media.length > MAX_MEDIA_FILES) {
        toast.error(`You can only send up to ${MAX_MEDIA_FILES} media files`);
        return;
      }

      if (text.trim()) {
        formData.append("text", text);
      }

      media.forEach((file) => {
        formData.append("media", file);
      });

      await createMessage({
        receiverId: user._id,
        formData,
      }).unwrap();

      setText("");
      setMedia([]);
      setPreviews([]);
    } catch (error: any) {
      console.log("error in handleInput: SelectChat.tsx-", error.data.message);
    }
  };

  return (
    <div className="flex flex-col w-full bg-background h-full z-60">
      <div className="h-14 sm:h-16 border-b border-border flex items-center gap-1.5 sm:gap-3 px-4 shrink-0">
        <div className="relative">
          <UserAvatar user={user} />
          <span
            className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background
      ${isOnline ? "bg-green-500" : "bg-red-500"}
    `}
          />
        </div>

        <div>
          <p className="text-sm font-medium">{user.userName}</p>
          <p className="text-xs text-muted-foreground">{statusText}</p>
        </div>
        <button className="ml-auto hover:opacity-70 transition">
          <X
            onClick={onClose}
            className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground"
          />
        </button>
      </div>

      <div className="flex-1 text-xs sm:text-sm overflow-y-auto p-4 space-y-2.5 sm:space-y-5 bg-muted/30">
        {isMessagesLoading ? (
          <MessageSkeleton />
        ) : (
          messages.map((message: Message) => {
            const isSender = message.senderId._id === authUserId;

            return (
              <MessageBubble
                key={message._id}
                message={message}
                isSender={isSender}
              />
            );
          })
        )}
        {/* div to scroll automatically */}
        <div ref={messagesEndRef} />
      </div>

      <div className="relative border-t border-border p-3 flex items-center gap-2 shrink-0">
        {previews.length > 0 && (
          <div
            className="
      absolute bottom-full mb-2
      max-w-[7.6rem]
      max-h-[20vh]
      bg-card border border-border p-2
      rounded-md
      overflow-y-auto
    "
          >
            <div className="flex flex-wrap  flex-row-reverse gap-2">
              {previews.map((item, i) => (
                <div
                  key={i}
                  className="
            relative
            h-10 w-10
            shrink-0
            border rounded-lg border-border
            flex items-center justify-center
            bg-muted
          "
                >
                  {/* IMAGE PREVIEW */}
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      className="h-full w-full object-cover rounded-md"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-[7px] text-primary text-center px-1">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:opacity-80"
                      >
                        Attachment
                      </a>
                    </div>
                  )}

                  {/* REMOVE */}
                  <button
                    onClick={() => {
                      setMedia((prev) => prev.filter((_, idx) => idx !== i));
                      setPreviews((prev) => prev.filter((_, idx) => idx !== i));
                    }}
                    className="absolute -top-1 -right-1 bg-black/70 text-white rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <input
          type="file"
          multiple
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
          className="hidden"
          id="media-upload"
          onChange={(e) => {
            if (e.target.files) {
              const files = Array.from(e.target.files);
              setMedia(files);
              const previewItems: PreviewItem[] = files.map((file) => ({
                url: URL.createObjectURL(file),
                type: getPreviewType(file),
                name: file.name,
              }));
              setPreviews(previewItems);
            }
          }}
        />
        {}
        <label
          htmlFor="media-upload"
          className="text-muted-foreground cursor-pointer absolute left-6"
        >
          <ImagePlus className="h-4 w-4" />
        </label>
        <Input
          placeholder="Message..."
          className="flex-1 pl-9  text-xs sm:text-sm"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
        <button
          onClick={handleInput}
          disabled={
            isCreateMessageLoading || (!text.trim() && media.length === 0)
          }
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
