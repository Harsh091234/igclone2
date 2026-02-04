import  { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../utils/ThemeProvider";
import {
  Settings,
  // Bookmark,
  SunMedium,
  MessageCircleWarning,
  // Activity,
  LogOut,
  UserPlus,
  CircleEllipsis,
  Moon,
} from "lucide-react";
import { useClerk } from "@clerk/clerk-react";

interface MoreMenuProps {
    isOpen: boolean,
    onClose?: () => void
}

export default function MoreMenu({ isOpen, onClose }: MoreMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const {signOut} = useClerk()
const { theme, setTheme } = useTheme();
  const onHandleLogout = () => {
    onClose?.();
    signOut();
  }
  
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose && onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);
  if(!isOpen) return;
   return (
     <div
       ref={panelRef}
       className="
    absolute bottom-5 left-17 w-64 p-3
    border border-border
    bg-card
    shadow-xl rounded-2xl
    z-50
  "
     >
       {/* Links */}
       <Link
         to="/settings"
         onClick={onClose}
         className="
      flex items-center gap-3 px-3 py-2 text-sm rounded-lg
      text-foreground
      hover:bg-accent
      transition-colors duration-200
    "
       >
         <Settings size={18} />
         <span>Settings</span>
       </Link>
       {/* 
       <Link
         to="/activity"
         onClick={onClose}
         className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg
      text-foreground
      hover:bg-accent
      transition-colors duration-200"
       >
         <Activity size={18} />
         <span>Your activity</span>
       </Link>

       <Link
         to="/saved"
         onClick={onClose}
         className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg
      text-foreground
      hover:bg-accent
      transition-colors duration-200"
       >
         <Bookmark size={18} />
         <span>Saved</span>
       </Link> */}

       <hr className="my-2 mx-2 border-t border-border" />

       <button
         onClick={() => {
           setTheme(theme === "dark" ? "light" : "dark");
           onClose?.();
         }}
         className="
      flex items-center gap-3 px-3 py-2 w-full text-sm rounded-lg
      text-foreground
      hover:bg-accent
      transition-colors duration-200
    "
       >
         {theme === "dark" ? <SunMedium size={18} /> : <Moon size={18} />}
         <span>Switch appearance</span>
       </button>

       <button
         onClick={onClose}
         className="
      flex items-center gap-3 px-3 py-2 w-full text-sm rounded-lg
      text-foreground
      hover:bg-accent
      transition-colors duration-200
    "
       >
         <MessageCircleWarning size={18} />
         <span>Report a problem</span>
       </button>

       <hr className="my-2 mx-2 border-t border-border" />

       <button
         onClick={onClose}
         className="
      flex items-center w-full gap-3 px-3 py-2 text-sm rounded-lg
      text-foreground
      hover:bg-accent
      transition-colors duration-200
    "
       >
         <CircleEllipsis size={18} />
         <span>Threads</span>
       </button>

       <hr className="my-2 mx-2 border-t border-border" />

       <button
         onClick={onClose}
         className="
      flex items-center w-full gap-3 px-3 py-2 text-sm rounded-lg
      text-foreground
      hover:bg-accent
      transition-colors duration-200
    "
       >
         <UserPlus size={18} />
         <span>Switch accounts</span>
       </button>

       {/* Destructive Logout Button */}
       <button
         onClick={onHandleLogout}
         className="
      flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg
      text-destructive
      hover:bg-destructive/10
      transition-colors duration-200
    "
       >
         <LogOut size={18} />
         <span>Log out</span>
       </button>
     </div>
   );
}

