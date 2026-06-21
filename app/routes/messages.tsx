import { useEffect } from "react";
import { Link, redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { MessageCircle, Plus } from "lucide-react";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { useAuth } from "~/modules/authentication/use-authentication";
import { TopBar } from "~/lumora/components/TopBar";
import { BottomNav } from "~/lumora/components/BottomNav";
import { Avatar } from "~/lumora/components/Avatar";
import { useMessages } from "~/lumora/hooks/useSocial";
import { cn } from "~/lib/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return { user };
}

function formatTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return "now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function MessagesPage() {
  const { user } = useAuth();
  const { conversations, loading, fetchConversations } = useMessages();

  useEffect(() => { fetchConversations(); }, []);

  return (
    <div className="min-h-screen bg-background">
      <TopBar
        showLogo={false}
        title="Messages"
        showActions={false}
        rightAction={
          <button className="p-2 text-foreground hover:text-muted-foreground">
            <Plus size={22} strokeWidth={1.5} />
          </button>
        }
      />

      <main className="max-w-lg mx-auto pb-20">
        {loading && conversations.length === 0 && (
          <div className="space-y-1 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
                <div className="flex-1">
                  <div className="h-3 bg-muted animate-pulse rounded mb-2 w-1/2" />
                  <div className="h-2 bg-muted animate-pulse rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <MessageCircle size={28} className="text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">No messages yet</p>
            <p className="text-muted-foreground text-sm mt-1">Start a conversation with someone you follow.</p>
            <Link to="/explore" className="mt-4 px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold">
              Find people
            </Link>
          </div>
        )}

        {conversations.map((msg: any) => {
          const isReceived = msg.receiverId?.toString() === user?.id;
          const otherUserId = isReceived ? msg.senderId : msg.receiverId;
          return (
            <Link
              key={msg._id}
              to={`/messages/${otherUserId}`}
              className={cn(
                "flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors",
                !msg.isRead && isReceived && "bg-primary/5"
              )}
            >
              <Avatar name={otherUserId?.toString() ?? ""} size={48} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-semibold text-sm text-foreground truncate">
                    {otherUserId?.toString() ?? "Unknown"}
                  </span>
                  <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{formatTime(msg.createdAt)}</span>
                </div>
                <p className={cn(
                  "text-sm truncate",
                  !msg.isRead && isReceived ? "font-semibold text-foreground" : "text-muted-foreground"
                )}>
                  {msg.senderId?.toString() === user?.id ? "You: " : ""}{msg.text || (msg.mediaUrl ? "Sent a photo" : "")}
                </p>
              </div>
              {!msg.isRead && isReceived && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </main>

      <BottomNav />
    </div>
  );
}
