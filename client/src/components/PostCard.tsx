
interface PostCardProps{
    img: string;
}

export const PostCard = ({img}: PostCardProps) => {
  return (
   
<div className="w-full aspect-square overflow-hidden rounded-xl shadow">
<img src={img} alt="post" className="w-full h-full object-cover" />
</div>
   
  )
}

export default PostCard
