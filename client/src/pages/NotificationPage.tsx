import { useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";

import { Badge } from "../components/ui/badge";
import { Bell } from "lucide-react";
import { getSocket } from "../utils/socket";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";

import UserAvatar from "../components/UserAvatar";
import { formatTimeAgo } from "../utils/timeFormatter";
import {
  notificationApi,
  useGetNotificationsQuery,
} from "../services/notificationApi";
import { useNavigate } from "react-router-dom";
import NotificationsSkeleton from "../components/Skeletons/NotificationsSkeleton";

const NotificationPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: notificationData, isLoading: isNotificationLoading } =
    useGetNotificationsQuery(undefined);
  const navigate = useNavigate();
  const notifications = notificationData?.notifications;

  console.log("data", notifications);
  useEffect(() => {
    console.log("📄 [NotificationPage] mounted");

    const socket = getSocket();
    if (!socket) return;

    console.log("🔌 [NotificationPage] socket found:", socket.id);
    socket.onAny((event, ...args) => {
      console.log("📡 SOCKET EVENT:", event, args);
    });

    const handleNotification = (data: any) => {
      console.log("🔔 notification received:", data);
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
            if (exists) return;

            draft.notifications.unshift({
              ...data,
              isRead: false,
            });
          },
        ),
      );
    };
    const handleRemoveNotification = ({
      type,
      sender,
      post,
      comment,
      story,
    }: {
      type: string;
      sender: string;
      story: string;
      post: string;
      comment: string;
    }) => {
      console.log("🗑️ remove notification received:", type, sender);
      dispatch(
        notificationApi.util.updateQueryData(
          "getNotifications",
          undefined,
          (draft: any) => {
            if (!Array.isArray(draft.notifications)) return;

            draft.notifications = draft.notifications.filter(
              (n: any) =>
                !(
                  n.type === type &&
                  n.sender._id === sender &&
                  n.post?._id === post &&
                  n.story?._id === story &&
                  n.comment?._id === comment
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
  useEffect(() => {
    console.log("notification data", notificationData);
  });

  return (
    <div className="min-h-screen  overflow-y-auto px-4 sm:px-45 py-4 sm:py-6 w-full  flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mt-5  mb-6">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Bell className="w-5 h-5" /> Notifications
        </h1>
        <Badge variant="secondary">Today</Badge>
      </div>

      {/* <button className="text-sm hover:text-blue-500 flex ml-auto text-primary mb-4">
          Mark all as read
        </button> */}
      {/* Notifications list */}
      <div className=" max-w-xl xl:max-w-2xl space-y-3 mb-15 sm:mb-0">
        {isNotificationLoading ? (
          <NotificationsSkeleton />
        ) : notifications && notifications.length > 0 ? (
          /* Notifications list */
          notifications.map((n: any) => (
            <Card
              key={n._id}
              className={`border-none shadow-sm transition ${
                !n.isRead ? "bg-accent/40" : "bg-card"
              }`}
            >
              <CardContent className="flex items-center gap-4">
                {/* Avatar */}
                <div className="shrink-0">
                  <UserAvatar
                    onClick={() => navigate(`/profile/${n.sender.userName}`)}
                    user={n.sender}
                    classes="h-10 w-10 cursor-pointer"
                  />
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm break-words">
                    <span
                      onClick={() => navigate(`/profile/${n.sender.userName}`)}
                      className="
    relative font-medium cursor-pointer
    after:content-['']
    after:absolute after:left-0 after:-bottom-0.5
    after:h-[1px] after:w-0
    after:bg-current
    after:transition-all after:duration-300 after:ease-out
    hover:after:w-full
  "
                    >
                      {n.sender.userName}
                    </span>{" "}
                    {n.message}
                    {n.comment && (
                      <span className="ml-1 text-muted-foreground ">
                        {n.comment.text}
                      </span>
                    )}
                  </p>

                  <span className="text-xs text-muted-foreground">
                    {n.createdAt && formatTimeAgo(n.createdAt)}
                  </span>
                </div>

                {/* Media Preview */}
                {(n.post?.media?.length > 0 || n.story?.media) && (
                  <div className="shrink-0 h-10 w-10 rounded overflow-hidden">
                    {/* Post Media */}
                    {n.post?.media?.length > 0 ? (
                      n.post.media[0].type === "image" ? (
                        <img
                          src={n.post.media[0].url}
                          alt="post"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={n.post.media[0].url}
                          className="w-full h-full object-cover"
                          muted
                        />
                      )
                    ) : /* Story Media */
                    n.story?.media?.type === "image" ? (
                      <img
                        src={n.story.media.url}
                        alt="story"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={n.story.media.url}
                        className="w-full h-full object-cover"
                        muted
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          /* Empty state */
          <p className="text-sm text-muted-foreground text-center">
            No notifications found
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
