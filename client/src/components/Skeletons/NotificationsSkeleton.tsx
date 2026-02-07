import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";


const NotificationsSkeleton = () => {
 return (
   <div className="max-w-xl space-y-3">
     {Array.from({ length: 5 }).map((_, i) => (
       <Card key={i} className="border-none shadow-sm bg-card">
         <CardContent className="flex items-center gap-4">
           {/* Avatar */}
           <Skeleton className="h-10 w-10 rounded-full shrink-0" />

           {/* Text */}
           <div className="flex-1 space-y-2">
             <Skeleton className="h-4 w-[80%]" />
             <Skeleton className="h-3 w-[40%]" />
           </div>

           {/* Post thumbnail */}
       
         </CardContent>
       </Card>
     ))}
   </div>
 );
}

export default NotificationsSkeleton
