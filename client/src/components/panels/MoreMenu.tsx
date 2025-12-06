import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Settings,
  Bookmark,
  SunMedium,
  MessageCircleWarning,
  Activity,
  LogOut,
  UserPlus,
  CircleEllipsis,
} from "lucide-react";
import { useClerk } from "@clerk/clerk-react";

interface MoreMenuProps {
    isOpen: boolean,
    onClose?: () => void
}

export default function MoreMenu({ isOpen, onClose }: MoreMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const {signOut} = useClerk()

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
        absolute 
        bottom-5 
        left-12 
        w-64 p-3 
        border bg-white border-gray-200 
        animate-fadeIn 
        shadow-xl rounded-2xl
        z-50
      "
     >
       <Link
         to="/settings"
         onClick={onClose}
         className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-(--secondary)"
       >
         <Settings size={18} />
         <span>Settings</span>
       </Link>

       <Link
         to="/activity"
         onClick={onClose}
         className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-(--secondary)"
       >
         <Activity size={18} />
         <span>Your activity</span>
       </Link>

       <Link
         to="/saved"
         onClick={onClose}
         className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-(--secondary)"
       >
         <Bookmark size={18} />
         <span>Saved</span>
       </Link>

       <hr className="my-2 mx-2 text-(--secondary)" />

       <button
         onClick={onClose}
         className="flex items-center gap-3 px-3 py-2 w-full text-sm rounded-lg hover:bg-(--secondary)"
       >
         <SunMedium size={18} />
         <span>Switch appearance</span>
       </button>

       <button
         onClick={onClose}
         className="flex items-center gap-3 px-3 py-2 w-full text-sm rounded-lg hover:bg-(--secondary)"
       >
         <MessageCircleWarning size={18} />
         <span>Report a problem</span>
       </button>

       <hr className="my-2 mx-2 text-(--secondary)" />

       <button
         onClick={onClose}
         className="flex items-center w-full gap-3 px-3 py-2 text-sm rounded-lg hover:bg-(--secondary)"
       >
         <CircleEllipsis size={18} />
         <span>Threads</span>
       </button>

       <hr className="my-2 mx-2 text-(--secondary)" />

       <button
         onClick={onClose}
         className="flex items-center w-full gap-3 px-3 py-2 text-sm rounded-lg hover:bg-(--secondary)"
       >
         <UserPlus size={18} />
         <span>Switch accounts</span>
       </button>

       <button
         onClick={onHandleLogout}
         className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-(--secondary) text-red-500"
       >
         <LogOut size={18} />
         <span>Log out</span>
       </button>
     </div>
   );
}

