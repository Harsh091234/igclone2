import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  className: string
}

export default function VideoPlayer({ src, className }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  /* ───────── Controls ───────── */

  const togglePlay = () => {
    if (!videoRef.current) return;
    videoRef.current.paused
      ? videoRef.current.play()
      : videoRef.current.pause();
    setIsPlaying(!videoRef.current.paused);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleSeek = (value: number[]) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = (value[0] / 100) * duration;
    setProgress(value[0]);
  };

  return (
    <div className={`relative ${className} group`}>
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        className="h-full w-full object-cover"
        onClick={togglePlay}
        onTimeUpdate={() => {
          if (!videoRef.current) return;
          setProgress((videoRef.current.currentTime / duration) * 100 || 0);
        }}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
      />

      {/* Controls */}
      <div
        className="
          absolute inset-x-0 bottom-0
          bg-gradient-to-t from-black/80 via-black/40 to-transparent
          px-3 pb-2 pt-6
         
        
        "
      >
        {/* Progress */}
        <Slider
          value={[progress]}
          onValueChange={handleSeek}
          className="mb-1.5"
          trackClassName="h-[2px] bg-white/30 rounded-full"
          rangeClassName="bg-white rounded-full"
          thumbClassName="
    h-2.5 w-2.5
    bg-white
    rounded-full
    opacity-0
    group-hover:opacity-100
    transition-opacity
  "
        />

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={togglePlay}
              className="text-white hover:bg-white/10"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={toggleMute}
              className="text-white hover:bg-white/10"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
