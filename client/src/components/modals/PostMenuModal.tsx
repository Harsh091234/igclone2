import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import {
  useGetAuthUserQuery,
  useGetProfileUserQuery,
} from "../../services/userApi";
import { useDeletePostMutation } from "../../services/postApi";
import AccountInfoModal from "./AccountInfoModal";
import { useState } from "react";
import { DialogOverlay } from "@radix-ui/react-dialog";

const PostActionDivider = () => <div className="h-px bg-border" />;

interface PostActionButtonProps {
  label: string;
  onClick?: () => void;
  destructive?: boolean;
}

const PostActionButton = ({
  label,
  onClick,
  destructive = false,
}: PostActionButtonProps) => {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`
        w-full h-10.5 sm:h-12 rounded-none text-xs sm:text-sm font-medium
        ${
          destructive
            ? "text-destructive hover:text-destructive"
            : "text-primary"
        }
      `}
    >
      {label}
    </Button>
  );
};

interface PostMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postOwnerName: string | undefined;
}

export const PostMenuModal = ({
  isOpen,
  onClose,
  postOwnerName,
  postId,
}: PostMenuModalProps) => {
  const [deletePost] = useDeletePostMutation();
  const { data: userData } = useGetAuthUserQuery();
  const authUser = userData?.user;
  const isOwner = postOwnerName === authUser?.userName;
  const [isAccountInfoOpen, setIsAccountInfoOpen] = useState<boolean>(false);
  const { isLoading: isProfileLoading, data: profileData } =
    useGetProfileUserQuery(postOwnerName!);
  const user = profileData?.user;

  return (
    <div className="px-5">
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="p-0 gap-0  sm:max-w-[400px] rounded-2xl overflow-hidden">
          {isOwner ? (
            <>
              <PostActionButton
                label="Delete post"
                destructive
                onClick={() => {
                  deletePost(postId);
                  onClose();
                }}
              />
              <PostActionDivider />
            </>
          ) : (
            <>
              <PostActionButton
                label="Report"
                destructive
                onClick={() => {
                  onClose();
                }}
              />
              <PostActionDivider />
            </>
          )}

          {/* <PostActionButton
            label="Go to post"
            onClick={() => {
              onClose();
            }}
          />
          <PostActionDivider /> */}
          {isOwner && (
            <>
              {/* <PostActionButton
                label="Edit Post"
                onClick={() => {
                  onClose();
                }}
              />
              <PostActionDivider /> */}
            </>
          )}

          {/* <PostActionButton
            label="Share to..."
            onClick={() => {
              onClose();
            }}
          />
          <PostActionDivider /> */}

          {/* <PostActionButton
            label="Copy link"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              onClose();
            }}
          />
          <PostActionDivider /> */}

          {/* <PostActionButton
            label="Embed"
            onClick={() => {
              onClose();
            }}
          />
          <PostActionDivider /> */}

          <PostActionButton
            label="About this account"
            onClick={() => {
              onClose();
              setIsAccountInfoOpen(true);
            }}
          />
          <PostActionDivider />

          <PostActionButton label="Cancel" onClick={onClose} />
        </DialogContent>
      </Dialog>
      {isAccountInfoOpen && (
        <AccountInfoModal
          isLoading={isProfileLoading}
          user={user}
          onClose={() => setIsAccountInfoOpen(false)}
        />
      )}
    </div>
  );
};
