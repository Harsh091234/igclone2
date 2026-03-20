import { Separator } from "../ui/separator";
import { X } from "lucide-react";

interface ReelModalProps {
  onClose: () => void;
  isAuthUser: boolean;
  onFollow: () => void;
  isFollowed: boolean;
  onGoToPost: () => void;
  onAboutThisAccount: () => void;
}

export default function ReelOptionsModal({
  onClose,
  isAuthUser,
  onFollow,
  isFollowed,
  onGoToPost,
  onAboutThisAccount,
}: ReelModalProps) {
  return (
    <div
      onClick={onClose}
      className="fixed bg-black/24 px-5 sm:px-0  inset-0 w-screen h-screen z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <div className="absolute inset-0" />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full  sm:w-sm  rounded-xl bg-background shadow-xl border border-border overflow-hidden"
      >
        {/* Close */}
        <button onClick={onClose} className="absolute right-2 top-2">
          <X className="w-4 h-4 sm:h-5 sm:w-5 hover:text-primary text-muted-foreground" />
        </button>

        <div className="flex flex-col text-xs sm:text-sm">
          <button className="px-4  py-3.5 text-center font-medium text-destructive hover:bg-muted transition">
            Report
          </button>

          <Separator className="" />

          {!isAuthUser && (
            <>
              <button
                onClick={() => {
                  onFollow();
                  onClose();
                }}
                className="px-4 py-2.5 sm:py-3.5 text-center font-medium hover:bg-muted transition"
              >
                {isFollowed ? "Unfollow" : "Follow"}
              </button>

              <Separator />
            </>
          )}

          <button
            onClick={() => {
              onClose();
              onGoToPost();
            }}
            className="px-4 py-2.5 sm:py-3.5 text-center font-medium hover:bg-muted transition"
          >
            Go to post
          </button>

          <Separator />

          {/* <button className="px-4 py-2.5 sm:py-3.5 text-center font-medium hover:bg-muted transition">
            Share to...
          </button>

          <Separator />

          <button className="px-4 py-2.5  sm:y-3.5 text-center font-medium hover:bg-muted transition">
            Copy link
          </button>

          <Separator />

          <button className="px-4 py-2.5 sm:py-3.5 text-center font-medium hover:bg-muted transition">
            Embed
          </button>

          <Separator /> */}

          <button
            onClick={() => {
              onClose();
              onAboutThisAccount();
            }}
            className="px-4 py-2.5 sm:py-3.5 text-center font-medium hover:bg-muted transition"
          >
            About this account
          </button>
        </div>
      </div>
    </div>
  );
}
