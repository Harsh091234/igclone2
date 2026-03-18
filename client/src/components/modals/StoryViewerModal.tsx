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
  const [progress, setProgress] = useState(0);
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
  const [viewStory] = useViewStoryMutation();
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
  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);
  useEffect(() => {
    if (!currentStory || currentStory.media.type !== "image") return;

    setProgress(0);

    const duration = 15000000; // 15 sec
    const interval = 100;

    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          clearInterval(timer);
          goNext();
          return 100;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, currentStory]);
  if (!open || !stories || stories.length === 0) return null;

  const isLiked = currentStory.likes?.includes(authUserId);
  return (
    <div className="fixed inset-0 bg-primary-foreground z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between  p-2 text-primary">
        <div className="flex items-center gap-3 ">
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
      <div className="flex-1  flex items-center justify-center">
        {/* IMPORTANT: relative stays HERE */}

        <div
          className="relative w-full max-w-screen sm:max-w-sm h-full max-h-full md:max-h-[43rem] bg-black overflow-hidden sm:rounded-xl
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

          <div className="absolute top-2 left-0 right-0 px-2 flex items-center gap-1 z-50">
            {stories.map((_, i) => (
              <div
                key={i}
                className="flex-1 h-[3px] bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-150 ease-linear"
                  style={{
                    width:
                      i < currentIndex
                        ? "100%"
                        : i === currentIndex
                          ? `${progress}%`
                          : "0%",
                  }}
                />
              </div>
            ))}
          </div>
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
                  <div className="h-full w-full flex items-center">
                    <video
                      key={index === currentIndex ? "active" : "inactive"}
                      src={s.media.url}
                      className=" aspect-video bg-black"
                      autoPlay={index === currentIndex}
                      muted
                      onTimeUpdate={(e) => {
                        if (index !== currentIndex) return;

                        const video = e.currentTarget;
                        const percent =
                          (video.currentTime / video.duration) * 100;
                        setProgress(percent);
                      }}
                      playsInline
                      onEnded={() => {
                        if (index === currentIndex) goNext();
                      }}
                    />
                  </div>
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
