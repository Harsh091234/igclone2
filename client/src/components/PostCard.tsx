
interface PostCardProps{
   
    url: string;
    type: "image" | "video";
    onClick?: () => void;
}

export const PostCard = ({ url, type, onClick}: PostCardProps) => {
  return (
    <div onClick={onClick} className="w-full aspect-square overflow-hidden rounded-xl shadow hover:cursor-pointer">
      {type === "image" ? (
        <img src={url} alt="post" className="w-full h-full object-cover" />
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
          src={url}
        />
      )}
    </div>
  );
}

export default PostCard
