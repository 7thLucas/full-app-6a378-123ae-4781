import { useEffect, useState, useRef } from "react";
import { Link, redirect, useParams } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark, Send } from "lucide-react";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { useAuth } from "~/modules/authentication/use-authentication";
import { Avatar } from "~/lumora/components/Avatar";
import { VerifiedBadge } from "~/lumora/components/VerifiedBadge";
import { BottomNav } from "~/lumora/components/BottomNav";
import { cn } from "~/lib/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return { user };
}

function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n ?? 0);
}

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.postId ?? "";
  const { user } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [saved, setSaved] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [sending, setSending] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!postId) return;
    Promise.all([
      fetch(`/api/social/posts/${postId}`).then(r => r.json()),
      fetch(`/api/social/posts/${postId}/comments`).then(r => r.json()),
    ]).then(([postData, commentsData]) => {
      if (postData.success) {
        setPost(postData.data);
        setLiked(postData.data.isLiked ?? false);
        setLikes(postData.data.likesCount ?? 0);
        setSaved(postData.data.isSaved ?? false);
      }
      if (commentsData.success) setComments(commentsData.data ?? []);
    }).catch(console.error).finally(() => setLoading(false));
  }, [postId]);

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes(prev => newLiked ? prev + 1 : prev - 1);
    fetch(`/api/social/posts/${postId}/like`, { method: newLiked ? "POST" : "DELETE" }).catch(() => {});
  };

  const handleSave = () => {
    const newSaved = !saved;
    setSaved(newSaved);
    fetch(`/api/social/posts/${postId}/save`, { method: newSaved ? "POST" : "DELETE" }).catch(() => {});
  };

  const handleComment = async () => {
    if (!commentText.trim() || sending) return;
    const t = commentText.trim();
    setCommentText("");
    setSending(true);
    try {
      const res = await fetch(`/api/social/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: t }),
      });
      const data = await res.json();
      if (data.success) {
        setComments(prev => [{ ...data.data, author: { username: user?.username } }, ...prev]);
      }
    } catch {
      setCommentText(t);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <p className="text-muted-foreground">Post not found</p>
        <Link to="/" className="text-primary text-sm mt-2">Go home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-navbar border-b border-border px-4 flex items-center gap-3 h-14">
        <Link to={-1 as any} className="p-1 -ml-1 text-foreground hover:text-muted-foreground">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="font-semibold text-foreground">Post</h1>
      </header>

      <main className="max-w-lg mx-auto pb-20">
        {/* Author row */}
        <div className="flex items-center justify-between px-4 py-3">
          <Link to={`/profile/${post.author?._id}`} className="flex items-center gap-3">
            <Avatar src={post.author?.avatarUrl} name={post.author?.username} size={32} />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-sm text-foreground">{post.author?.username}</span>
                {post.author?.isVerified && <VerifiedBadge size={14} />}
              </div>
            </div>
          </Link>
        </div>

        {/* Media */}
        <div className="bg-black aspect-square overflow-hidden">
          {post.type === "video" ? (
            <video src={post.mediaUrl} controls playsInline className="w-full h-full object-contain" />
          ) : (
            <img src={post.mediaUrl} alt={post.caption} className="w-full h-full object-contain" />
          )}
        </div>

        {/* Actions */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <button onClick={handleLike} className={cn("transition-colors", liked ? "text-destructive" : "text-foreground")}>
                <Heart size={24} strokeWidth={1.5} className={liked ? "fill-current" : ""} />
              </button>
              <button onClick={() => commentInputRef.current?.focus()} className="text-foreground">
                <MessageCircle size={24} strokeWidth={1.5} />
              </button>
              <button className="text-foreground">
                <Share2 size={24} strokeWidth={1.5} />
              </button>
            </div>
            <button onClick={handleSave} className={cn("transition-colors", saved ? "text-primary" : "text-foreground")}>
              <Bookmark size={24} strokeWidth={1.5} className={saved ? "fill-current" : ""} />
            </button>
          </div>

          {likes > 0 && <p className="font-semibold text-sm text-foreground mb-1">{formatCount(likes)} likes</p>}

          {post.caption && (
            <p className="text-sm text-foreground mb-2">
              <span className="font-semibold mr-1">{post.author?.username}</span>
              {post.caption}
            </p>
          )}

          {post.hashtags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {post.hashtags.map((tag: string) => (
                <Link key={tag} to={`/explore?hashtag=${tag}`} className="text-primary text-sm font-medium">#{tag}</Link>
              ))}
            </div>
          )}
        </div>

        {/* Comments */}
        <div className="border-t border-border">
          <h3 className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Comments ({comments.length})
          </h3>
          {comments.map((comment: any) => (
            <div key={comment._id} className="flex items-start gap-3 px-4 py-2">
              <Avatar src={comment.author?.avatarUrl} name={comment.author?.username} size={32} />
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-sm text-foreground mr-1">{comment.author?.username}</span>
                <span className="text-sm text-foreground">{comment.text}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Comment input */}
      <div className="fixed bottom-16 left-0 right-0 bg-navbar border-t border-border px-4 py-2 flex items-center gap-3 max-w-lg mx-auto">
        <Avatar src={undefined} name={user?.username} size={32} />
        <input
          ref={commentInputRef}
          type="text"
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleComment()}
          placeholder="Add a comment..."
          className="flex-1 bg-muted rounded-2xl px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          onClick={handleComment}
          disabled={!commentText.trim() || sending}
          className="text-primary font-semibold text-sm disabled:opacity-40"
        >
          <Send size={18} />
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
