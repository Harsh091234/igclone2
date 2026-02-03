import { Card } from "./ui/card";

interface Media {
  url: string;
  type: string;
}

interface MessageBubbleProps {
  message: any;
  isSender: boolean;
}

const MessageBubble = ({ message, isSender }: MessageBubbleProps) => {
  const images = message.media?.filter((m: Media) => m.type === "image") || [];
  const otherMedia =
    message.media?.filter((m: Media) => m.type !== "image") || [];

  return (
    <Card
      className={`
        max-w-xs md:max-w-sm xl:max-w-md p-2 space-y-1.5
        ${isSender ? "ml-auto bg-secondary" : "bg-background"}
      `}
    >
      {/* 🖼️ IMAGES */}
      {images.length > 0 && (
        <div
          className={`grid gap-1 ${
            images.length === 1
              ? "grid-cols-1"
              : images.length === 2
                ? "grid-cols-2"
                : "grid-cols-3"
          }`}
        >
          {images.map((img: Media, i: number) => (
            <img
              key={i}
              src={img.url}
              alt="media"
              className="rounded-md object-cover w-full max-h-60"
            />
          ))}
        </div>
      )}

      {/* 📄 OTHER MEDIA */}
      {otherMedia.map((file: Media, i: number) => (
        <a
          key={i}
          href={file.url}
          target="_blank"
          className="block text-xs text-blue-500 underline"
        >
          Attachment {i + 1}
        </a>
      ))}

      {/* ✏️ TEXT (always AFTER media) */}
      {message.text && (
        <p className="text-sm break-words pt-1">{message.text}</p>
      )}
    </Card>
  );
};

export default MessageBubble;
