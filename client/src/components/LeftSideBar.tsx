import { useEffect, useState } from "react";
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

import CreatePostModal from "./modals/CreatePostModal";
import { useGetMeQuery } from "../services/authApi";
import { notificationApi, useGetNotificationsQuery } from "../services/notificationApi";
import { useDispatch } from "react-redux";
import { getSocket } from "../utils/socket";
import type { AppDispatch } from "../store/store";

const LeftSideBar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState<boolean>(false);
  const [isCreatePostModelOpen, setIsCreatePostModelOpen] =
    useState<boolean>(false);
    const { data: notificationData } = useGetNotificationsQuery(undefined);
  const dispatch = useDispatch<AppDispatch>();
    const hasUnread = notificationData?.notifications?.some(
      (n: any) => !n.isRead,
    );
  const { data } = useGetMeQuery(undefined);
  const authUser = data?.user;

   useEffect(() => {
      const socket = getSocket();
      if (!socket) return;

      const handleNotification = (data: any) => {
        dispatch(
          notificationApi.util.updateQueryData(
            "getNotifications",
            undefined,
            (draft: any) => {
              if (!Array.isArray(draft.notifications)) {
                draft.notifications = [];
              }

              const exists = draft.notifications.find(
                (n: any) => n._id === data._id,
              );

              if (!exists) {
                draft.notifications.unshift({
                  ...data,
                  isRead: false,
                });
              }
            },
          ),
        );
      };

      const handleRemoveNotification = (payload: any) => {
        dispatch(
          notificationApi.util.updateQueryData(
            "getNotifications",
            undefined,
            (draft: any) => {
              if (!Array.isArray(draft.notifications)) return;

              draft.notifications = draft.notifications.filter(
                (n: any) =>
                  !(
                    n.type === payload.type &&
                    n.sender._id === payload.sender &&
                    n.post?._id === payload.post &&
                    n.story?._id === payload.story &&
                    n.comment?._id === payload.comment
                  ),
              );
            },
          ),
        );
      };

      socket.on("notification", handleNotification);
      socket.on("notification:remove", handleRemoveNotification);

      return () => {
        socket.off("notification", handleNotification);
        socket.off("notification:remove", handleRemoveNotification);
      };
    }, [dispatch]);

    
  if (!authUser) return;


   

  return (
    <aside className="w-full bg-card lg:h-screen h-0">
      {/* desktop navbar */}
      <div
        className="hidden h-screen  lg:flex flex-col items-center py-6 gap-6 select-none
  
    border-r border-primary/20
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
        <Link to="/notifications" className="relative">
          <Heart className="w-6 h-6" />
          {hasUnread && (
            <span
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full 
      bg-gradient-to-tr from-orange-400 to-purple-500 
      border-2 border-card"
            />
          )}
        </Link>
        <button onClick={() => setIsCreatePostModelOpen(true)} className="">
          <Plus className="w-6 h-6" />
        </button>

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
      </div>

      {/* mobile navbar */}
      <div
        className="lg:hidden bg-card fixed w-full bottom-0 right-0 left-0 z-40  flex items-center justify-between
    px-4 py-2 
    border-t border-border
  "
      >
        <Link to="/" className="flex items-center justify-center p-2">
          <Home className="w-5 h-5" />
        </Link>

        <Link to="/explore" className="flex items-center justify-center p-2">
          <Compass className="w-5 h-5" />
        </Link>

        <Link to="/reels" className="flex items-center justify-center p-2">
          <Film className="w-5 h-5" />
        </Link>

        <button
          onClick={() => setIsCreatePostModelOpen(true)}
          className="flex items-center justify-center p-2"
        >
          <Plus className="w-5 h-5" />
        </button>

        <Link to="/messages" className="flex items-center justify-center p-2">
          <Send className="w-5 h-5" />
        </Link>

        <Link
          to={`/profile/${authUser?.userName}`}
          className="flex items-center justify-center p-1"
        >
          <img
            src={
              authUser?.profilePic ||
              "https://res.cloudinary.com/djt8dpogs/image/upload/v1764859306/profile_pics/qx9p7qgrdtrwugkrae9e.png"
            }
            className="w-6 h-6 rounded-full object-cover"
            alt="profile"
          />
        </Link>
      </div>

      {isCreatePostModelOpen && (
        <CreatePostModal
          isOpen={isCreatePostModelOpen}
          onClose={() => setIsCreatePostModelOpen(false)}
        />
      )}
    </aside>
  );
};

export default LeftSideBar;
