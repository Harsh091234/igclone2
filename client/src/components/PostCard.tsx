import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { selectPostById } from "../redux/postSlice";
import type { Post } from "../types/post.types";

interface PostCardProps{
   
    postId: string;
    onClick?: () => void;
}

export const PostCard = ({ postId, onClick}: PostCardProps) => {
  const post = useSelector((state: RootState) => selectPostById(state, postId));

   if (!post) return null;

   const media = post.media?.[0];

   if (!media) return null;

  return (
    <div onClick={onClick} className="w-full aspect-square overflow-hidden rounded-xl shadow hover:cursor-pointer">
      {media.type === "image" ? (
        <img src={media.url} alt="post" className="w-full h-full object-cover" />
      ) : (
        <video
          className="w-full h-full object-cover"
          muted
          playsInline
          loop
         
          onMouseEnter={(e) => e.currentTarget.play()}
          onMouseLeave={(e) => {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0;
          }}
          src={media.url}
        />
      )}
    </div>
  );
}

export default PostCard
