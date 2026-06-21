import { useEffect, useRef, useState } from "react";
import { redirect, useParams, Link } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { ArrowLeft, Send, Image, Phone, Video } from "lucide-react";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { useAuth } from "~/modules/authentication/use-authentication";
import { Avatar } from "~/lumora/components/Avatar";
import { VerifiedBadge } from "~/lumora/components/VerifiedBadge";
import { useMessages, useProfile } from "~/lumora/hooks/useSocial";
import { cn } from "~/lib/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return { user };
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatPage() {
  const params = useParams();
  const otherUserId = params.userId ?? "";
  const { user } = useAuth();
  const { messages, loading, fetchMessages, sendMessage } = useMessages();
  const { profile, fetchProfile } = useProfile(otherUserId);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (otherUserId) {
      fetchMessages(otherUserId);
      fetchProfile();
    }
  }, [otherUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || sending) return;
    const t = text.trim();
    setText("");
    setSending(true);
    try {
      await sendMessage(otherUserId, t);
    } catch {
      setText(t);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-background" style={{ zIndex: 50 }}>
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-navbar z-10 flex-shrink-0">
        <Link to="/messages" className="p-1 -ml-1 text-foreground hover:text-muted-foreground">
          <ArrowLeft size={22} />
        </Link>
        <Link to={`/profile/${otherUserId}`} className="flex items-center gap-2 flex-1 min-w-0">
          <Avatar src={profile?.avatarUrl} name={profile?.username ?? otherUserId} size={32} />
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm text-foreground truncate">{profile?.username ?? otherUserId}</span>
              {profile?.isVerified && <VerifiedBadge size={14} />}
            </div>
            <span className="text-xs text-muted-foreground">{profile?.displayName}</span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <button className="p-2 text-foreground hover:text-muted-foreground" title="Voice call">
            <Phone size={20} strokeWidth={1.5} />
          </button>
          <button className="p-2 text-foreground hover:text-muted-foreground" title="Video call">
            <Video size={20} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading && messages.length === 0 && (
          <div className="flex justify-center mt-8">
            <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Avatar src={profile?.avatarUrl} name={profile?.username} size={64} />
            <p className="font-semibold text-foreground mt-3">{profile?.username ?? otherUserId}</p>
            <p className="text-muted-foreground text-sm mt-1">Say hello!</p>
          </div>
        )}

        {messages.map((msg: any, i: number) => {
          const isOwn = msg.senderId?.toString() === user?.id;
          const showTime = i === 0 || (new Date(msg.createdAt).getTime() - new Date(messages[i - 1]?.createdAt).getTime() > 300_000);

          return (
            <div key={msg._id}>
              {showTime && (
                <div className="flex justify-center my-2">
                  <span className="text-xs text-muted-foreground">{formatTime(msg.createdAt)}</span>
                </div>
              )}
              <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[70%] px-3 py-2 rounded-2xl text-sm leading-snug",
                    isOwn
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  )}
                >
                  {msg.mediaUrl && (
                    <img src={msg.mediaUrl} alt="media" className="rounded-xl mb-1 max-h-40 object-cover" />
                  )}
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-t border-border bg-navbar flex-shrink-0"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <button className="p-1.5 text-muted-foreground hover:text-foreground flex-shrink-0">
          <Image size={22} strokeWidth={1.5} />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Message..."
          className="flex-1 bg-muted rounded-2xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || sending}
          className="p-2 text-primary hover:opacity-70 disabled:opacity-30 transition-opacity flex-shrink-0"
        >
          <Send size={20} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
