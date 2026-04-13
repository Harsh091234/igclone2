import MainLogo from "./MainLogo";

const NoChatSelected = () => {
 return (
   <div className="w-full flex flex-1 flex-col items-center justify-center p-16 ">
     <div className="max-w-md flex flex-col  items-center text-center space-y-6">
    
       <MainLogo className="h-16 w-16"/>

    
       <h2 className="text-2xl font-bold tracking-tight">Your Messages</h2>

       <p className="text-muted-foreground text-sm">
         Send private photos and messages to a friend or group.
       </p>
     </div>
   </div>
 );
}

export default NoChatSelected
