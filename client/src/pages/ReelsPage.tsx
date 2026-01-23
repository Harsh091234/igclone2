
import { Heart, MessageCircle, Send, Bookmark, VolumeX } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../components/ui/carousel";

import UserAvatar from "../components/UserAvatar";

const reels = [
  {
    id: 1,
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    likes: "34.7K",
    comments: 310,
  },
  {
    id: 2,
    src: "https://www.w3schools.com/html/movie.mp4",
    likes: "12.1K",
    comments: 120,
  },
];

const ReelsPage = () => {
  return (
    <div className="flex justify-center pb-10 sm:pb-0 items-center text-foreground h-full bg-primary-foreground">
      <Carousel
        orientation="vertical"
        className="w-full min-[350px]:w-[300px] sm:w-[400px] "
      >
        <CarouselContent className="h-[80vh] sm:h-[94vh]">
          {reels.map((reel) => (
            <CarouselItem key={reel.id} className="h-full w-full">
              <Card className="border-0 bg-primary-foreground  min-[350px]:bg-card min-[350px]:border relative flex items-center h-full w-full  rounded-none  min-[350px]:rounded-xl overflow-hidden">
                {/* Video */}
                <video
                  src={reel.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className=" h-full w-full object-fill"
                />

                {/* Mute Icon */}
                <div className="absolute top-4 right-4 bg-black/50 p-2 rounded-full">
                  <VolumeX className="w-3 sm:w-4  sm:h-4 h-3 text-white" />
                </div>

                {/* Right Actions */}
                <div className="absolute right-3 bottom-24 flex flex-col items-center gap-2 sm:gap-2.5">
                  <button className="text-white hover:bg-white/10">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <span className="text-xs text-white">{reel.likes}</span>

                  <button className="text-white hover:bg-white/10">
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <span className="text-xs text-white">{reel.comments}</span>

                  {/* <button className="text-white hover:bg-white/10">
                    <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button> */}

                  <button className="text-white hover:bg-white/10">
                    <Bookmark className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-6 sm:bottom-5.5  w-full p-4 bg-gradient-to-t from-black/70 to-transparent text-white flex flex-col gap-1 sm:gap-2">
                  <div className="flex gap-2 sm:gap-5 items-center flex-wrap">
                    <div className="flex  gap-1 sm:gap-2 items-center">
                      <UserAvatar classes="h-7 w-7 sm:h-8 sm:w-8" />
                      <p className="text-xs sm:text-sm font-semibold">
                        @meme.ig
                      </p>
                    </div>

                    <button className="border text-[0.55rem] sm:text-xs bg-transparent text-white border-gray-400 py-0.5 sm:py-1 rounded-sm sm:rounded-md px-1.5 sm:px-3">
                      Follow
                    </button>
                  </div>

                  <p className="text-[0.65rem] sm:text-xs opacity-90">
                    When it's 15 Feb and bro is walking weirdly
                  </p>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

function Action({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label?: string | number;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        size="icon"
        variant="ghost"
        className="text-white hover:bg-white/10"
      >
        {icon}
      </Button>
      {label && <span className="text-xs text-white">{label}</span>}
    </div>
  );
}

export default ReelsPage
