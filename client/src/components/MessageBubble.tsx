import { useEffect, useState } from "react";
import { decryptText } from "../utils/crypto/crypto";
import { getSessionKey } from "../utils/session";
import { Card } from "./ui/card";

interface Media {
  url: string;
  type: string;
}

interface EncryptedMessage {
  _id: string;
  senderId: string | { _id: string };
  cipherText?: ArrayBuffer | Uint8Array;
  iv?: Uint8Array;
  media?: Media[];
}

interface MessageBubbleProps {
  message: EncryptedMessage;
  isSender: boolean;
   conversationId: string;
  senderPublicKey: ArrayBuffer; 
}

const MessageBubble = ({
  message,
  isSender,
  conversationId,
  senderPublicKey,
}: MessageBubbleProps) => {
   const [decryptedText, setDecryptedText] = useState<string>("");
  const images = message.media?.filter((m: Media) => m.type === "image") || [];
  const otherMedia =
    message.media?.filter((m: Media) => m.type !== "image") || [];

    useEffect(() => {
      let cancelled = false;

      async function decrypt() {
        if (!message.cipherText || !message.iv) return;

        try {
          const sessionKey = await getSessionKey(
            conversationId,
            senderPublicKey,
          );

          const text = await decryptText(
            message.cipherText,
            message.iv,
            sessionKey,
          );

          if (!cancelled) setDecryptedText(text);
        } catch (err) {
          console.error("Decryption failed", err);
        }
      }

      decrypt();
      return () => {
        cancelled = true;
      };
    }, [message.cipherText, message.iv, conversationId, senderPublicKey]);
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
      {decryptedText && (
        <p className="text-sm break-words pt-1">{decryptedText}</p>
      )}
    </Card>
  );
};

export default MessageBubble;
