import { X, Heart, Eye } from "lucide-react";
import { useState } from "react";
import UserAvatar from "../UserAvatar";
import StoryViewsPanel from "../panels/StoryViewPanel";
import { StoryViewsModal } from "./StoryViewsModal";

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

const viewersList = [
  {
    id: "1",
    userName: "john_doe",
    profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
    liked: true,
  },
  {
    id: "2",
    userName: "sarah_99",
    profilePic: "https://randomuser.me/api/portraits/women/44.jpg",
    liked: false,
  },
  {
    id: "3",
    userName: "alex_lee",
    profilePic: "https://randomuser.me/api/portraits/men/75.jpg",
    liked: true,
  },
  {
    id: "4",
    userName: "emma_wat",
    profilePic: "https://randomuser.me/api/portraits/women/68.jpg",
    liked: false,
  },
];

export default function StoryViewerModal({
  open,
  onClose,
  stories,
  initialIndex,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [storyList, setStoryList] = useState<Story[]>(stories);
  const [viewsOpen, setViewsOpen] = useState(false);

  const story = storyList[currentIndex];

  if (!open) return null;

  const goNext = () => {
    if (viewsOpen) return; // prevent navigation when modal open
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const goPrev = () => {
    if (viewsOpen) return;
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
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-primary">
        <div className="flex items-center gap-3">
          <UserAvatar classes="w-10 h-10" />
          <div>
            <p className="text-sm font-semibold">harsh sharma</p>
            <p className="text-xs text-secondary-foreground">12 feb 23</p>
          </div>
        </div>

        <button onClick={onClose}>
          <X />
        </button>
      </div>

      {/* Story Content */}
      <div className="flex-1 flex items-center justify-center">
        {/* IMPORTANT: relative stays HERE */}
        <div className="relative w-full max-w-screen sm:max-w-sm h-[85vh] bg-black overflow-hidden sm:rounded-xl">
          {/* Click Areas */}
          <div
            onClick={goPrev}
            className="absolute left-0 top-0 h-full w-1/2 z-20 cursor-pointer"
          />
          <div
            onClick={goNext}
            className="absolute right-0 top-0 h-full w-1/2 z-20 cursor-pointer"
          />

          {/* Slider */}
          <div
            className="flex h-full transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {storyList.map((s, index) => (
              <div
                key={s.id}
                className="min-w-full h-full flex items-center justify-center"
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

          {/* Bottom Overlay */}
          <div className="absolute bottom-0 left-0 w-full p-4 z-30 text-white bg-gradient-to-t from-black/80 to-transparent">
            {story.isOwn ? (
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => setViewsOpen(true)}
                >
                  <Eye size={19} />
                  <span>{story.viewers}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Heart size={19} />
                  <span>{story.likes}</span>
                </div>
              </div>
            ) : (
              <button
                onClick={toggleLike}
                className="flex ml-auto active:scale-90 transition"
              >
                <Heart
                  size={22}
                  className={
                    story.isLiked ? "fill-red-500 text-red-500" : "text-white"
                  }
                />
              </button>
            )}
          </div>

          {/* Mobile Bottom Sheet */}
          <div className="sm:hidden">
            <StoryViewsPanel
              open={viewsOpen}
              onClose={() => setViewsOpen(false)}
              viewers={viewersList}
            />
          </div>

          {/* Desktop Modal */}
          <div className="hidden sm:block">
            <StoryViewsModal
              open={viewsOpen}
              onClose={() => setViewsOpen(false)}
              viewers={viewersList}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
