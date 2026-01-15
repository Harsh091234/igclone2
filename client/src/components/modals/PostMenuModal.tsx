import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { useGetAuthUserQuery } from "../../services/userApi";
import { useDeletePostMutation } from "../../services/postApi";

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
        w-full h-12 rounded-none text-sm font-medium
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
  postOwnerName: string;
}

export const PostMenuModal = ({ isOpen, onClose, postOwnerName, postId }: PostMenuModalProps) => {
    const [deletePost, {isLoading}] = useDeletePostMutation();
    const {data: userData} = useGetAuthUserQuery();
    const authUser = userData?.user;
  const isOwner = postOwnerName === authUser?.userName ;
   
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-0 gap-0 max-w-[400px] rounded-2xl overflow-hidden">
       
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

        <PostActionButton
          label="Go to post"
          onClick={() => {
            onClose();
          }}
        />
        <PostActionDivider />

        <PostActionButton
          label="Share to..."
          onClick={() => {
            onClose();
          }}
        />
        <PostActionDivider />

        <PostActionButton
          label="Copy link"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            onClose();
          }}
        />
        <PostActionDivider />

        <PostActionButton
          label="Embed"
          onClick={() => {
            onClose();
          }}
        />
        <PostActionDivider />

        <PostActionButton
          label="About this account"
          onClick={() => {
            onClose();
          }}
        />
        <PostActionDivider />

        <PostActionButton label="Cancel" onClick={onClose} />
      </DialogContent>
    </Dialog>
  );
};
