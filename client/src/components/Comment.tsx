
import { formatTimeAgo } from '../utils/timeFormatter';


export interface CommentProps {
  text: string;
  author: {
    userName: string;
    profilePic: string;
  };
  likes: string[];
  createdAt: string;
  handleRouteToProfile: () => void;
}

const Comment = ({text, author, createdAt, handleRouteToProfile }: CommentProps) => {
   return (
     <div className="flex gap-3 items-center">
       <img
         onClick={handleRouteToProfile}
         src={author.profilePic}
         alt={author.userName}
         className="h-6 w-6 sm:h-7 sm:w-7 cursor-pointer   rounded-full object-cover"
       />

       <div className="flex-1">
         <p className="text-xs sm:text-sm text-foreground wrap-break-word">
           <span
             onClick={handleRouteToProfile}
             className="
    font-semibold mr-1 cursor-pointer relative
    after:absolute after:left-0 after:-bottom-[1px]
    after:h-[1px] after:w-0 after:bg-current
    after:transition-all after:duration-200
    hover:after:w-full 
  "
           >
             {author.userName}
           </span>
           <span className='wrap-anywhere'>{text}</span>
         </p>

         <div className="flex items-center gap-3 mt-0.5 sm:mt-1 text-[0.65rem] sm:text-xs text-muted-foreground ">
           <span>{formatTimeAgo(createdAt)}</span>
           {/* <span>{likes.length} likes</span> */}
           {/* <button className="font-semibold hover:text-foreground">
             Reply
           </button> */}
         </div>
       </div>

       {/* <Heart className="w-4 h-4 text-muted-foreground cursor-pointer" /> */}
     </div>
   );
}

export default Comment
