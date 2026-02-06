import { useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";

import { Badge } from "../components/ui/badge";
import { Bell } from "lucide-react";
import { getSocket } from "../utils/socket";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";

import UserAvatar from "../components/UserAvatar";
import { formatTimeAgo } from "../utils/timeFormatter";
import { notificationApi, useGetNotificationsQuery } from "../services/notificationApi";

const NotificationPage = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { data: notificationData, isLoading: isNotificationLoading } =
    useGetNotificationsQuery(undefined);
 const notifications = notificationData?.notifications;

console.log("data", notifications)
useEffect(() => {
  console.log("📄 [NotificationPage] mounted");

  const socket = getSocket();
  if (!socket) return;

  console.log("🔌 [NotificationPage] socket found:", socket.id);

  const handleNotification = (data: any) => {
    console.log("🔔 [NotificationPage] notification received:", data);

    dispatch(
      notificationApi.util.updateQueryData(
        "getNotifications",
        undefined,
        (draft: any[]) => {
          // prevent duplicates
          const exists = draft.some((n) => n._id === data._id);
          if (exists) return;

          draft.unshift({
            ...data,
            isRead: false,
          });
        },
      ),
    );
  };

  socket.on("notification", handleNotification);

  return () => {
    socket.off("notification", handleNotification);
  };
}, [dispatch]);
useEffect(() => {
    console.log("notification data", notificationData)
})

  if (isNotificationLoading || !notifications) return <div>Loading...</div>;
  return (
    <div className="min-h-screen bg-background flex justify-center px-4 py-6">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Bell className="w-5 h-5" /> Notifications
          </h1>
          <Badge variant="secondary">Today</Badge>
        </div>

        <button className="text-sm hover:text-blue-500 flex ml-auto text-primary mb-4">
          Mark all as read
        </button>
        {/* Notifications list */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center">
              No notifications
            </p>
          ) : (
            notifications.map((n: any) => (
              <Card
                key={n._id}
                className={`border-none shadow-sm transition ${
                  !n.isRead ? "bg-accent/40" : "bg-card"
                }`}
              >
                <CardContent className="flex items-center gap-4">
                  <UserAvatar user={n.sender} classes="h-10 w-10" />

                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{n.sender.userName}</span>{" "}
                      {n.message}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {n.createdAt && formatTimeAgo(n.createdAt)}
                    </span>
                  </div>

                  {!n.isRead && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
