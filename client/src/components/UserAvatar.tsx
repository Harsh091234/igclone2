
import type { User } from "../types/user.types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface UserAvatarProps {
    user: User;
    classes: string
}

const UserAvatar = ({user, classes}: UserAvatarProps) => {
   return (
     <Avatar className={`border ${classes} border-zinc-700 `}>
       <AvatarImage
         src={user.profilePic || "/default user.jpg"}
         alt="Profile"
         className="object-cover"
       />
       <AvatarFallback className="bg-zinc-800 text-white">
         {user.fullName?.slice(0, 2).toUpperCase() || "U"}
       </AvatarFallback>
     </Avatar>
   );

}

export default UserAvatar;
