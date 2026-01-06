import React, { useState } from "react";
import {
  Home,
  Search,
  Compass,
  Film,
  Send,
  Heart,
  Plus,
  Menu,
} from "lucide-react";
import { Link } from "react-router-dom";
import MoreMenu from "./panels/MoreMenu";
import SearchPanel from "./panels/SearchPanel";
import { useGetAuthUserQuery } from "../services/userApi";

const LeftSideBar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isSearchPanelOpen, setIsSearchPanelOpen] = useState<boolean>(false);
  
  const {data} = useGetAuthUserQuery();
  const authUser = data?.user;
  if(!authUser) return;

  return (
    <aside
      className="
  w-full h-screen flex flex-col items-center py-6 gap-6 select-none
  bg-white dark:bg-background
  border-r border-primary/20
  text-foreground dark:text-foreground
"
    >
      {/* Instagram Logo */}
      <Link to="/" className="cursor-pointer">
        <svg
          aria-label="Instagram"
          fill="none"
          height="24"
          viewBox="0 0 24 24"
          width="24"
        >
          <rect
            width="20"
            height="20"
            x="2"
            y="2"
            rx="5"
            stroke="currentColor"
            strokeWidth="2"
          ></rect>
          <circle
            cx="12"
            cy="12"
            r="4"
            stroke="currentColor"
            strokeWidth="2"
          ></circle>
          <circle cx="17" cy="7" r="1.2" fill="currentColor"></circle>
        </svg>
      </Link>

      {/* Nav Icons */}
      <Link to="/" className="">
        <Home className="w-6 h-6" />
      </Link>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsSearchPanelOpen(!isSearchPanelOpen);
        }}
        className=""
      >
        <Search className="w-6 h-6" />
      </button>
      <SearchPanel
        isSearchPanelOpen={isSearchPanelOpen}
        onClose={() => setIsSearchPanelOpen(false)}
      />
      <Link to="/explore" className="">
        <Compass className="w-6 h-6" />
      </Link>
      <Link to="/reels" className="r">
        <Film className="w-6 h-6" />
      </Link>
      <Link to="/messages" className="">
        <Send className="w-6 h-6" />
      </Link>
      <Link to="/notifications" className="">
        <Heart className="w-6 h-6" />
      </Link>
      <Link to="/create" className="">
        <Plus className="w-6 h-6" />
      </Link>

      {/* Profile Pic */}
      <Link to={`/profile/${authUser?.userName}`}>
        <img
          src={
            authUser?.profilePic ||
            "https://res.cloudinary.com/djt8dpogs/image/upload/v1764859306/profile_pics/qx9p7qgrdtrwugkrae9e.png"
          }
          className="w-7 h-7 rounded-full object-cover "
          alt="profile"
        />
      </Link>

      {/* Menu / Settings */}
      <button className="mt-auto" onClick={() => setIsOpen(!isOpen)}>
        <Menu className="w-6 h-6" />
        <MoreMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </button>
    </aside>
  );
};

export default LeftSideBar;
