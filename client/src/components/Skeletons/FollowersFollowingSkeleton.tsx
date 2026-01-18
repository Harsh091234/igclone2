
import { Skeleton } from "../ui/skeleton";
const FollowersFollowingSkeleton = () => {
 return (
   <div className="space-y-4">
     {Array.from({ length: 6 }).map((_, i) => (
       <div key={i} className="flex items-center justify-between">
         <div className="flex items-center gap-3">
         
           <Skeleton className="h-10 w-10 rounded-full" />

         
           <div className="space-y-1">
             <Skeleton className="h-4 w-24" />
             <Skeleton className="h-3 w-32" />
           </div>
         </div>

        
         <Skeleton className="h-8 w-[7rem] rounded-md" />
       </div>
     ))}
   </div>
 );
}

export default FollowersFollowingSkeleton
