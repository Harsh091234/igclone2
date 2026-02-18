import { X, Heart, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import UserAvatar from "../UserAvatar";

interface Story {
  id: string;
  user: {
    userName: string;
    profilePic: string;
  };
  media: {
    type: "image" | "video";
    url: string;
    publicId: string;
  };
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  viewers: number;
  isOwn?: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  stories: Story[];
  initialIndex: number;
}

export default function StoryViewerModal({
  open,
  onClose,
  stories,
  initialIndex,

}: Props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [storyList, setStoryList] = useState<Story[]>(stories);
const story = storyList[currentIndex];

  if (!open) return null;

const goNext = () => {
  if (currentIndex < stories.length - 1) {
    setCurrentIndex((prev) => prev + 1);
  } else {
    onClose(); // close if last story
  }
};

const goPrev = () => {
  if (currentIndex > 0) {
    setCurrentIndex((prev) => prev - 1);
  }
};


const toggleLike = () => {
  setStoryList((prev) =>
    prev.map((s, i) =>
      i === currentIndex
        ? {
            ...s,
            isLiked: !s.isLiked,
            likes: s.isLiked ? s.likes - 1 : s.likes + 1,
          }
        : s,
    ),
  );
};

  return (
    <div className="fixed inset-0 bg-primary-foreground z-50 flex flex-col">
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 text-primary">
        <div className="flex items-center gap-3">
          <UserAvatar classes="w-10 h-10" />
          <div>
            <p className="text-sm font-semibold">{"harsh sharmna"}</p>
            <p className="text-xs text-secondary-foreground">{"12 feb 23"}</p>
          </div>
        </div>

        <button onClick={onClose}>
          <X />
        </button>
      </div>

      {/* Story Content */}
      {/* Story Content */}
      <div className="flex-1 flex items-center justify-center bg-primary-foreground">
        <div className="relative w-full max-w-screen sm:max-w-sm h-[85vh] bg-black overflow-hidden  sm:rounded-xl">
          {/* CLICK AREAS */}
          <div
            onClick={goPrev}
            className="absolute left-0 top-0 h-full w-1/2 z-20 cursor-pointer"
          />
          <div
            onClick={goNext}
            className="absolute right-0 top-0 h-full w-1/2 z-20 cursor-pointer"
          />

          {/* SLIDER */}
          <div
            className="flex h-full transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {storyList.map((s, index) => (
              <div
                key={s.id}
                className="min-w-full h-full relative flex items-center justify-center bg-black"
              >
                {s.media.type === "image" ? (
                  <img
                    src={s.media.url}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <video
                    src={s.media.url}
                    className="h-full w-full object-cover"
                    autoPlay={index === currentIndex}
                  />
                )}
              </div>
            ))}
          </div>

          {/* OVERLAY (NOW ABOVE STORY) */}
          <div className="absolute bottom-0 left-0 w-full p-4 z-30 text-white bg-gradient-to-t from-black/80 to-transparent">
            {story.isOwn ? (
              <div className="flex text-base items-center justify-between">
                <div className="flex items-center gap-1">
                  <Eye size={19} />
                  <span className="">{story.viewers}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Heart size={19} />
                  <span className="">{story.likes}</span>
                </div>
              </div>
            ) : (
              <button
                onClick={toggleLike}
                className="flex ml-auto group transition-transform duration-200 active:scale-90"
              >
                <Heart
                  size={22}
                  className={`
      transition-all duration-300
      ${
        story.isLiked
          ? "fill-red-500 text-red-500 scale-110"
          : "text-white group-hover:text-red-400 group-hover:scale-110"
      }
    `}
                />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
    </div>
  );
}
