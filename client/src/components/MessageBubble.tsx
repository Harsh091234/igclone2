import { formatTimeAgo } from "../utils/timeFormatter";
import { Card } from "./ui/card";
import UserAvatar from "./UserAvatar";

interface Media {
  url: string;
  type: string;
}

interface User {
  _id: string;
  userName: string;
  profilePic?: string;
}

interface Message {
  _id: string;
  text?: string;
  media?: Media[];
  senderId: User;
  receiverId: User;
  createdAt: string;
}

interface MessageBubbleProps {
  message: Message;
  isSender: boolean;
}

const MessageBubble = ({ message, isSender }: MessageBubbleProps) => {
  const images = message.media?.filter((m) => m.type === "image") || [];
  const otherMedia = message.media?.filter((m) => m.type !== "image") || [];

  return (
    <div className={`flex gap-2 ${isSender ? "justify-end" : "justify-start"}`}>
      {/* Avatar only for receiver messages */}

      <div
        className={`flex  flex-col gap-2 ${isSender ? "items-end" : "items-start"} `}
      >
        <div className="flex gap-1.5 items-center">
          <UserAvatar
            classes="h-5 w-5"
            profilePic={message.senderId.profilePic}
          />
          <p className="text-xs font-medium text-muted-foreground leading-none">
            {message.senderId.userName}
          </p>
        </div>

        <div
          className={`
    max-w-xs md:max-w-sm xl:max-w-md
    px-3 py-2 
    border-b border-r border-l border-border
    rounded-2xl
    text-sm
   ${
     isSender
       ? "ml-auto bg-secondary  shadow-md  text-secondary-foreground rounded-br-sm"
       : "bg-card  text-card-foreground shadow-md rounded-bl-sm"
   }
  `}
        >
          {/* 🖼️ IMAGES */}
          {images.length > 0 && (
            <div
              className={`grid gap-1 mb-1 ${
                images.length === 1
                  ? "grid-cols-1"
                  : images.length === 2
                    ? "grid-cols-2"
                    : "grid-cols-3"
              }`}
            >
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt="media"
                  className="rounded-lg object-cover w-full max-h-56"
                />
              ))}
            </div>
          )}

          {/* 📄 FILES */}
          {otherMedia.map((file, i) => (
            <a
              key={i}
              href={file.url}
              target="_blank"
              className="block text-xs text-blue-500 hover:underline mb-0.5"
            >
              📎 Attachment {i + 1}
            </a>
          ))}

          {/* ✏️ TEXT */}
          {message.text && (
            <p className="leading-snug break-words">{message.text}</p>
          )}

          {/* ⏰ TIME */}
          <p
            className={`text-[10px] mt-2 text-muted-foreground ${
              isSender ? "text-right" : "text-left"
            }`}
          >
            {formatTimeAgo(message.createdAt)} ago
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
