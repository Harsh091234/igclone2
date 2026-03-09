import { X, Heart, Eye, Trash2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import UserAvatar from "../UserAvatar";
import StoryViewsPanel from "../panels/StoryViewPanel";
import { StoryViewsModal } from "./StoryViewsModal";
import { formatTimeAgo } from "../../utils/timeFormatter";
import {
  useDeleteStoryMutation,
  useLazyGetStoryViewsQuery,
  useLikeStoryMutation,
  useViewStoryMutation,
} from "../../services/storyApi";

interface TextLayer {
  _id: string;
  text: string;
  x: number; // either % or px
  y: number; // either % or px
  color: string;
}

interface Story {
  _id: string;
  user: {
    _id: string;
    userName: string;
    profilePic: string;
  };
  media: {
    type: "image" | "video";
    url: string;
    publicId: string;
  };
  createdAt: string;
  likes: string[];
  isLiked?: boolean;
  viewersCount?: number;
  textLayers: TextLayer[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  stories: Story[];
  isStoryOwner?: boolean;
  initialIndex: number;
  authUserId: string;
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
  isStoryOwner,
  initialIndex,
  authUserId,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [fetchStoryViews, { data: viewsData, isLoading: viewsLoading }] =
    useLazyGetStoryViewsQuery();
  const [deleteStory, { isLoading: deletingStory }] = useDeleteStoryMutation();
  const [currentStory, setCurrentStory] = useState(stories[currentIndex]);
  const viewers =
    viewsData?.viewers?.map((view: any) => ({
      id: view.user._id,
      userName: view.user.userName,
      profilePic: view.user.profilePic,
      liked: view.liked,
    })) || [];
  const [viewsOpen, setViewsOpen] = useState(false);
  const [likeStory, { isLoading: isLiking }] = useLikeStoryMutation();
  const [viewStory, { isLoading: viewersLoading }] = useViewStoryMutation();
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

  const handleViewsOpen = async () => {
    try {
      await fetchStoryViews(currentStory._id).unwrap();
      setViewsOpen(true);
    } catch (error: any) {
      console.error(error);
    }
  };
  const handleDelete = async () => {
    try {
      const res = await deleteStory(currentStory._id).unwrap();
      console.log("delete res", res);
      onClose();
    } catch (error: any) {
      console.error(error);
    }
  };
  const handleLike = async () => {
    if (isLiking) return;

    try {
      await likeStory({
        storyId: currentStory._id,
        userId: authUserId,
      }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };
  const resetState = () => {
    setCurrentIndex(initialIndex); // go back to starting story
    setViewsOpen(false); // close viewers panel
  };
  useEffect(() => {
    console.log("stories in modal tsxddd:", stories);
  });
  useEffect(() => {
    if (currentStory) {
      viewStory({ storyId: currentStory._id, userId: authUserId });
    }
  }, [currentStory, viewStory, authUserId]);
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);
  useEffect(() => {
    setCurrentStory(stories[currentIndex]);
  }, [currentIndex, stories]);
  useEffect(() => {
    if (viewsData?.viewers) {
      setCurrentStory(
        (prev) =>
          prev && {
            ...prev,
            viewersCount: viewsData.viewers.length,
          },
      );
    }
  }, [viewsData]);
  if (!open || !stories || stories.length === 0) return null;

  const isLiked = currentStory.likes?.includes(authUserId);
  return (
    <div className="fixed inset-0 bg-primary-foreground z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-primary">
        <div className="flex items-center gap-3">
          <UserAvatar user={currentStory.user} classes="w-10 h-10" />
          <div>
            <p className="text-sm font-semibold">
              {currentStory.user.userName}
            </p>
            <p className="text-xs text-secondary-foreground">
              {" "}
              {`${formatTimeAgo(currentStory.createdAt)}   `}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            onClose();
          }}
        >
          <X />
        </button>
      </div>

      {/* Story Content */}
      <div className="flex-1 flex items-center justify-center">
        {/* IMPORTANT: relative stays HERE */}

        <div
          className="relative w-full max-w-screen sm:max-w-sm h-[85vh] bg-black overflow-hidden sm:rounded-xl
        "
        >
          {isStoryOwner && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={deletingStory}
              className="absolute z-50 top-2 right-3 p-2 rounded-full  text-red-500 
             hover:bg-red-500 hover:text-white transition disabled:opacity-60"
            >
              {deletingStory ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Trash2 size={20} />
              )}
            </button>
          )}
          {/* Click Areas */}
          <div className="absolute inset-0 z-40 pointer-events-none">
            <div
              onClick={goPrev}
              className="absolute left-0 top-0 h-full w-1/2 cursor-pointer pointer-events-auto"
            />
            <div
              onClick={goNext}
              className="absolute right-0 top-0 h-full w-1/2 cursor-pointer pointer-events-auto"
            />
          </div>
          {/* Slider */}
          <div
            className="flex  h-full transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {stories.map((s, index) => (
              <div key={s._id} className="min-w-full h-full relative">
                {s.media.type === "image" ? (
                  <img
                    src={s.media.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <video
                    key={index === currentIndex ? "active" : "inactive"}
                    src={s.media.url}
                    className="h-full w-full object-cover"
                    autoPlay={index === currentIndex}
                    muted
                    playsInline
                  />
                )}

                {/* Text Layers */}
                {s.textLayers?.map((layer, i) => (
                  <span
                    key={i}
                    className="absolute"
                    style={{
                      left: `${layer.x}%`,
                      top: `${layer.y}%`,
                      transform: "translate(-50%, -50%)",
                      color: layer.color,
                    }}
                  >
                    {layer.text}
                  </span>
                ))}
              </div>
            ))}
          </div>

          {/* Bottom Overlay */}
          <div className="absolute bottom-0 left-0 w-full p-4 z-50 text-white bg-gradient-to-t from-black/80 to-transparent">
            {isStoryOwner ? (
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center z-50 gap-1 cursor-pointer"
                  onClick={handleViewsOpen}
                >
                  <Eye size={19} />
                  <span>{currentStory.viewersCount ?? 0}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Heart size={19} />
                  <span>{currentStory.likes.length}</span>
                </div>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
                disabled={isLiking}
                className="flex ml-auto active:scale-90 z-50 transition"
              >
                <Heart
                  size={22}
                  className={
                    isLiked ? "fill-red-500 text-red-500" : "text-white"
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
              viewers={viewers}
              loading={viewsLoading}
            />
          </div>

          {/* Desktop Modal */}
          <div className="hidden sm:block">
            <StoryViewsModal
              open={viewsOpen}
              onClose={() => setViewsOpen(false)}
              viewers={viewers}
              loading={viewsLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
