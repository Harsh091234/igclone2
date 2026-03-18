import { X, Heart } from "lucide-react";
import UserAvatar from "../UserAvatar";
import { ViewerSkeleton } from "../Skeletons/StoryViewsSkeleton";

interface Viewer {
  id: string;
  userName: string;
  profilePic: string;
  liked?: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  viewers: Viewer[];
  loading: boolean;
}

export function StoryViewsModal({ open, onClose, loading, viewers }: Props) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/40 z-40" />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center z-50">
        <div className="bg-white w-full sm:w-[350px] rounded-2xl max-h-[70vh] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <p className="font-semibold text-lg">Views ({viewers.length})</p>
            <button onClick={onClose}>
              <X />
            </button>
          </div>

          {/* List */}
          <div className="overflow-y-auto max-h-[60vh]">
            {loading ? (
              <ViewerSkeleton count={5} />
            ) : viewers.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No views yet</div>
            ) : (
              viewers.map((viewer) => (
                <div
                  key={viewer.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      user={{
                        _id: viewer.id,
                        userName: viewer.userName,
                        profilePic: viewer.profilePic,
                      }}
                      classes="w-9 h-9"
                    />
                    <span className="font-medium text-sm">
                      {viewer.userName}
                    </span>
                  </div>
                  {viewer.liked && (
                    <Heart size={18} className="text-red-500 fill-red-500" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
