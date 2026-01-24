
import type { Author } from "../types/post.types";
import type { User } from "../types/user.types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface UserAvatarProps {
    user?: User | Author;
    classes?: string
    onClick?: () => void;
}

const UserAvatar = ({user, classes, onClick}: UserAvatarProps) => {
   return (
     <Avatar onClick={onClick} className={`border ${classes} border-zinc-700 `}>
       <AvatarImage
         src={user?.profilePic || "/default user.jpg"}
         alt="Profile"
         className="object-cover"
       />
       <AvatarFallback className="bg-zinc-800 text-white">
         {user?.fullName?.slice(0, 2).toUpperCase() || "U"}
       </AvatarFallback>
     </Avatar>
   );

}

export default UserAvatar;
