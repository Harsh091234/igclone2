import { useState } from "react";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import FollowersFollowingSkeleton from "../Skeletons/FollowersFollowingSkeleton";
import { useGetProfileUserQuery } from "../../services/userApi";
import { useNavigate } from "react-router-dom";

export interface follower {
  _id: string;
  userName?: string;
  profilePic?: string;
  fullName?: string;
}

interface FollowersModalProps {
  onClose: () => void;
  isFollowing?: boolean;
  handleFollow: (userId: string) => void;
  userName?: string;
  authUserId?: string;
  authFollowing: string[];
}
const FollowersModal = ({
  onClose,
  isFollowing,
  handleFollow,
  userName,
  authUserId,
  authFollowing,
}: FollowersModalProps) => {
  const [search, setSearch] = useState("");
  const { isLoading, data: userData } = useGetProfileUserQuery(userName ?? "");
  const followers = userData?.user?.followers ?? [];
  const navigate = useNavigate();

  const handleRouteToProfile = (userName: any) => {
    onClose();
    navigate(`/profile/${userName}`);
  };

  console.log("id:", authUserId);
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      >
        {/* Modal */}
        <div onClick={(e) => e.stopPropagation()} className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="flex h-[520px] w-full max-w-md flex-col overflow-hidden rounded-xl border bg-background shadow-lg">
            {/* Header */}
            <div className="relative border-b px-4 py-3">
              <h2 className="text-sm font-semibold text-center">Followers</h2>
              <Button
                size="icon"
                variant="ghost"
                onClick={onClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Search */}
            <div className="border-b px-4 py-3">
              <Input
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 bg-muted"
              />
            </div>

            {/* Followers List */}
            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="space-y-4 px-4 py-4">
                {isLoading ? (
                  <FollowersFollowingSkeleton />
                ) : followers.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground">
                    No users found
                  </p>
                ) : (
                  followers.map((follower) => {
                    const isFollowerAuthUser =
                      follower._id.toString() === authUserId;

                    const isAuthFollowingThisFollower = authFollowing.includes(
                      follower._id.toString(),
                    );
                    return (
                      <div
                        key={follower._id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar
                            onClick={() =>
                              handleRouteToProfile(follower.userName)
                            }
                            className="h-10 cursor-pointer w-10"
                          >
                            <AvatarImage src={follower.profilePic} />
                            <AvatarFallback>
                              {(follower.userName?.[0] ?? "?").toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex flex-col">
                            <span
                              onClick={() =>
                                handleRouteToProfile(follower.userName)
                              }
                              className="text-sm font-medium cursor-pointer"
                            >
                              {follower?.userName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {follower.fullName ?? ""}
                            </span>
                          </div>
                        </div>

                        {!isFollowerAuthUser && (
                          <Button
                            size="sm"
                            onClick={() => handleFollow(follower._id)}
                            className={`w-[7rem] text-sm justify-center transition-colors ${
                              isAuthFollowingThisFollower
                                ? "bg-muted text-foreground hover:bg-muted/80"
                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                            }`}
                          >
                            {isAuthFollowingThisFollower
                              ? "Unfollow"
                              : "Follow"}
                          </Button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </>
  );
};

export default FollowersModal;
