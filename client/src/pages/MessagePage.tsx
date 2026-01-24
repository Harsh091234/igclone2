import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Search, Send, SquarePen } from "lucide-react";
import { ScrollArea } from "../components/ui/scroll-area";



const MessagePage = () => {
  return (
    // ✅ FIX 1: use h-screen
    <div className="h-screen w-full bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="w-full sm:w-[35%] md:w-[40%] lg:w-sm border-r border-border flex flex-col">
        {/* Header (fixed height) */}
        <div className="px-4 pt-6 pb-2 border-b border-border shrink-0">
          <h1 className="text-lg md:text-xl px-4 mb-2 flex justify-between font-semibold tracking-tight">
            Username
            <SquarePen className="cursor-pointer hover:text-primary/60 h-5 w-5 md:h-6 md:w-6 transition-colors" />
          </h1>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-9 py-2 bg-muted text-sm md:text-base"
            />
          </div>

          <h2 className="text-base md:text-lg font-semibold">Messages</h2>
        </div>

        {/* ✅ FIX 2: flex-1 instead of fixed height */}
        <div className="flex-1 overflow-y-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((chat) => (
            <div
              key={chat}
              className="flex items-center gap-3 px-4 py-1.5 md:py-3 cursor-pointer hover:bg-muted/60"
            >
              <Avatar className="h-9 w-9 md:h-10 md:w-10">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className="text-sm font-medium">username_{chat}</p>
                <p className="text-xs text-muted-foreground truncate">
                  Last message preview goes here...
                </p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <main className="hidden sm:flex flex-1 flex-col">
        {/* Header */}
        <div className="h-16 border-b border-border flex items-center gap-3 px-4 shrink-0">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">username</p>
            <p className="text-xs text-muted-foreground">Active now</p>
          </div>
        </div>

        {/* ✅ FIX 3: messages take remaining height */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
          <Card className="max-w-xs p-2 text-sm">Hey 👋</Card>
          <Card className="max-w-xs p-2 text-sm ml-auto bg-primary text-primary-foreground">
            Hi! What's up?
          </Card>
          <Card className="max-w-xs p-2 text-sm">
            Working on a new project 🚀
          </Card>
        </div>

        {/* Input */}
        <div className="border-t border-border p-3 flex items-center gap-2 shrink-0">
          <Input placeholder="Message..." className="flex-1" />
          <button className="p-2 rounded-md bg-primary text-primary-foreground hover:opacity-90">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  );
};


export default MessagePage;
