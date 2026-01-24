
import { X, Calendar, MapPin, Shield } from "lucide-react";
import UserAvatar from "../UserAvatar";
import type { User } from "../../types/user.types";
import AccountInfoModalSkeleton from "../Skeletons/AccountInfoSkeleton";
import { formatTimeAgo } from "../../utils/timeFormatter";
interface AccountInfoModalProps {
  user?: User;
  onClose: () => void;
  isLoading: boolean;
}

const AccountInfoModal = ({ onClose, user, isLoading }: AccountInfoModalProps) => {
    
    console.log("user", user)
    if(isLoading) return <AccountInfoModalSkeleton onClose={onClose}/>

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-[92%] max-w-[420px]
          bg-card text-card-foreground
          rounded-xl shadow-lg 
          p-3
        "
      >
        {/* Header */}
        <div className="flex items-center justify-center  relative">
          <h2 className="text-base min-[300px]:text-lg font-semibold">About this account</h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 right-0 absolute top-0 text-muted-foreground hover:text-foreground" />
          </button>
        </div>

        <div className="my-3 h-px bg-border" />

        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 mb-3 min-[300px]:mb-10">
          <UserAvatar  
          user={user}
          classes="h-12 w-12 min-[300px]:h-14 min-[300px]:w-14" />

          <div className="text-center">
            <p className="font-semibold text-sm min-[300px]:text-base">{user?.userName}</p>
            <p className="text-xs min:[300px]:text-sm text-muted-foreground">
              {user?.bio}
            </p>
          </div>

          {/* <span className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
            Verified Account
          </span> */}
        </div>

        {/* Divider */}

        {/* Info Rows */}
        <div className="space-y-3 text-xs min-[300px]:text-sm px-3 pb-2">
          <div className="flex items-center flex-col min-[300px]:flex-row gap-0.5 min-[300px]:gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground ">Date joined</span>
            <span className="min-[300px]:ml-auto font-medium">{formatTimeAgo( user?.createdAt??"")}</span>
          </div>

          <div className="flex items-center flex-col min-[300px]:flex-row gap-0.5 min-[300px]:gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Account based in</span>
            <span className="min-[300px]:ml-auto font-medium">{user?.location || "Not provided"}</span>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default AccountInfoModal;
