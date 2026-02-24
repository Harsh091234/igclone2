import { X, Heart } from "lucide-react";
import UserAvatar from "../UserAvatar";

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
}

export function StoryViewsModal({ open, onClose, viewers }: Props) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/40 z-40" />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center z-50">
        <div className="bg-white w-[400px] rounded-2xl max-h-[70vh] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <p className="font-semibold text-lg">Views ({viewers.length})</p>
            <button onClick={onClose}>
              <X />
            </button>
          </div>

          {/* List */}
          <div className="overflow-y-auto max-h-[60vh]">
            {viewers.map((viewer) => (
              <div
                key={viewer.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <UserAvatar classes="w-9 h-9" />
                  <span className="font-medium text-sm">{viewer.userName}</span>
                </div>
                {viewer.liked && (
                  <Heart size={18} className="text-red-500 fill-red-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
