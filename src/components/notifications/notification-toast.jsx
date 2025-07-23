import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../hooks/use-auth";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card"; // ✅ Fixed import path
import { Bell, X } from "lucide-react";
import { cn } from "../../lib/utils"; // ✅ Fixed import path

export function NotificationToast() {
  const { user } = useAuth();
  const [visibleNotifications, setVisibleNotifications] = useState([]); // ✅ Removed TypeScript syntax
  const [lastNotificationCount, setLastNotificationCount] = useState(0);

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
    enabled: !!user,
    refetchInterval: 30000, // Poll every 30 seconds for new notifications
  });

  useEffect(() => {
    if (notifications && notifications.length > lastNotificationCount) {
      const newNotifications = notifications.slice(lastNotificationCount);
      const unreadNew = newNotifications.filter((n) => !n.isRead);

      if (unreadNew.length > 0) {
        const latestNotification = unreadNew[0];
        setVisibleNotifications((prev) => [...prev, latestNotification]);

        setTimeout(() => {
          setVisibleNotifications((prev) =>
            prev.filter((n) => n.id !== latestNotification.id)
          );
        }, 5000);
      }

      setLastNotificationCount(notifications.length);
    }
  }, [notifications, lastNotificationCount]);

  const hideNotification = (notificationId) => {
    setVisibleNotifications((prev) =>
      prev.filter((n) => n.id !== notificationId)
    );
  };

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-24 right-6 z-50 space-y-2">
      {visibleNotifications.map((notification) => (
        <Card
          key={notification.id}
          className={cn(
            "w-80 shadow-lg border-l-4 border-ocean-blue transform transition-all duration-300",
            "animate-in slide-in-from-right-5"
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Bell className="h-5 w-5 text-ocean-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 break-words">
                  {notification.message}
                </p>
                <p className="text-xs text-slate-text mt-1">
                  {new Date(notification.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="flex-shrink-0 h-6 w-6 p-0 hover:bg-gray-100"
                onClick={() => hideNotification(notification.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
