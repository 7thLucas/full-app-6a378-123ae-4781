import { useEffect } from "react";
import { Link, redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Bell, Heart, MessageCircle, UserPlus, MessageSquare, Shield } from "lucide-react";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { TopBar } from "~/lumora/components/TopBar";
import { BottomNav } from "~/lumora/components/BottomNav";
import { Avatar } from "~/lumora/components/Avatar";
import { useNotifications } from "~/lumora/hooks/useSocial";
import { cn } from "~/lib/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return { user };
}

const NOTIF_ICONS: Record<string, any> = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  dm: MessageSquare,
  mention: MessageCircle,
  system: Shield,
};

function formatTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationsPage() {
  const { notifications, loading, unreadCount, fetchNotifications, markAllRead } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (unreadCount > 0) markAllRead();
  }, [unreadCount]);

  return (
    <div className="min-h-screen bg-background">
      <TopBar showLogo={false} title="Notifications" showActions={false} />

      <main className="max-w-lg mx-auto pb-20">
        {loading && notifications.length === 0 && (
          <div className="space-y-1 mt-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="w-12 h-12 rounded-full bg-muted animate-pulse flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-3 bg-muted animate-pulse rounded mb-2 w-3/4" />
                  <div className="h-2 bg-muted animate-pulse rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bell size={28} className="text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">No notifications yet</p>
            <p className="text-muted-foreground text-sm mt-1">When someone likes or comments on your posts, you'll see it here.</p>
          </div>
        )}

        {notifications.map((notif: any) => {
          const Icon = NOTIF_ICONS[notif.type] ?? Bell;
          return (
            <Link
              key={notif._id}
              to={
                notif.type === "follow" ? `/profile/${notif.fromUser?._id}` :
                notif.type === "dm" ? `/messages/${notif.fromUser?._id}` :
                notif.targetId ? `/posts/${notif.targetId}` : "#"
              }
              className={cn(
                "flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors",
                !notif.isRead && "bg-primary/5"
              )}
            >
              <div className="relative flex-shrink-0">
                <Avatar
                  src={notif.fromUser?.avatarUrl}
                  name={notif.fromUser?.username ?? "System"}
                  size={48}
                />
                <span
                  className={cn(
                    "absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center",
                    notif.type === "like" ? "bg-destructive" :
                    notif.type === "follow" ? "bg-primary" :
                    notif.type === "comment" ? "bg-accent" :
                    "bg-muted-foreground"
                  )}
                >
                  <Icon size={13} className="text-white" />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-snug">{notif.message}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{formatTime(notif.createdAt)}</p>
              </div>
              {!notif.isRead && (
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </main>

      <BottomNav />
    </div>
  );
}
