import {  useState } from "react";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { useGetMeQuery } from "../../services/authApi";
import { X } from "lucide-react";
import FollowersFollowingSkeleton from "../Skeletons/FollowersFollowingSkeleton";
import { useGetProfileUserQuery } from "../../services/userApi";
import { useNavigate } from "react-router-dom";
import type { User } from "../../types/user.types";

export interface FollowingUser {
  _id: string;
  userName?: string;
  profilePic?: string;
  fullName?: string;
}

interface FollowingModalProps {
  onClose: () => void;
  handleFollow: (userId: string) => void;
  userName?: string;
  authUserId?: string;
  user: User;
  authFollowing: string[];
}

const FollowingModal = ({
  onClose,
  handleFollow,
  userName,
  
  authUserId,

}: FollowingModalProps) => {
  const [search, setSearch] = useState("");
const { data: profileData , isLoading} = useGetProfileUserQuery(userName ?? "", {
  skip: !userName,
});
const following = profileData?.user?.following ?? [];
  const navigate = useNavigate();
const { data: authData } = useGetMeQuery(undefined);
const authUser = authData?.user;
  const normalizedFollowing = (following ?? []).map((u: any) => ({
  _id: typeof u === "string" ? u : u._id,
  userName: u.userName,
  fullName: u.fullName,
  profilePic: u.profilePic,
}));

  const handleRouteToProfile = (userName?: string) => {
    if (!userName) return;
    onClose();
    navigate(`/profile/${userName}`);
  };

 
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="flex h-[76vh] sm:h-xl w-full max-w-md flex-col overflow-hidden rounded-xl border bg-background shadow-lg">
            {/* Header */}
            <div className="relative border-b px-4 py-3">
              <h2 className="text-sm sm:text-base font-semibold text-center">
                Following
              </h2>
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
                className="h-9 text-sm sm:text-base bg-muted"
              />
            </div>

            {/* Following List */}
            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="space-y-4 px-4 py-4">
                {isLoading ? (
                  <FollowersFollowingSkeleton />
                ) : following.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground">
                    Not following anyone
                  </p>
                ) : (
                  normalizedFollowing.map((user: FollowingUser) => {
                    const isAuthUser = user._id.toString() === authUserId;

                   const isAuthFollowingUser = (authUser?.following ?? []).some(
  (u: any) => (typeof u === "string" ? u : u._id) === user._id
);
                    return (
                      <div
                        key={user._id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar
                            onClick={() => handleRouteToProfile(user.userName)}
                            className="h-8 sm:h-10 w-8 sm:w-10 cursor-pointer"
                          >
                            <AvatarImage src={user.profilePic} />
                            <AvatarFallback>
                              {(user.userName?.[0] ?? "?").toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex flex-col text-xs  sm:text-sm">
                            <span
                              onClick={() =>
                                handleRouteToProfile(user.userName)
                              }
                              className="font-medium cursor-pointer"
                            >
                              {user.userName}
                            </span>
                            <span className=" text-muted-foreground">
                              {user.fullName ?? ""}
                            </span>
                          </div>
                        </div>

                        {!isAuthUser && (
                          <Button
                            size="sm"
                            onClick={() => handleFollow(user._id)}
                            className={`w-[6rem] sm:w-[7rem] text-xs sm:text-sm justify-center transition-colors ${
                              isAuthFollowingUser
                                ? "bg-muted text-foreground hover:bg-muted/80"
                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                            }`}
                          >
                            {isAuthFollowingUser ? "Unfollow" : "Follow"}
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

export default FollowingModal;
