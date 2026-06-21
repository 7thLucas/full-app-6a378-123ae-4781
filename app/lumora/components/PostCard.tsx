import { useState } from "react";
import { Link } from "react-router";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Volume2, VolumeX } from "lucide-react";
import { Avatar } from "./Avatar";
import { VerifiedBadge } from "./VerifiedBadge";
import { cn } from "~/lib/utils";

interface Post {
  _id: string;
  type: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  caption: string;
  hashtags?: string[];
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
  author: {
    _id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
    isVerified?: boolean;
  };
}

interface PostCardProps {
  post: Post;
  onLike?: (postId: string, liked: boolean) => void;
  onSave?: (postId: string, saved: boolean) => void;
  onComment?: (postId: string) => void;
  currentUserId?: string;
}

function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function formatTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function PostCard({ post, onLike, onSave, onComment, currentUserId }: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked ?? false);
  const [likes, setLikes] = useState(post.likesCount);
  const [saved, setSaved] = useState(post.isSaved ?? false);
  const [likeAnimating, setLikeAnimating] = useState(false);

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes(prev => newLiked ? prev + 1 : prev - 1);
    if (newLiked) {
      setLikeAnimating(true);
      setTimeout(() => setLikeAnimating(false), 400);
    }
    onLike?.(post._id, newLiked);
  };

  const handleSave = () => {
    const newSaved = !saved;
    setSaved(newSaved);
    onSave?.(post._id, newSaved);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: post.caption, url: `/posts/${post._id}` }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(`${window.location.origin}/posts/${post._id}`).catch(() => {});
    }
  };

  return (
    <article className="bg-card border-b border-border">
      {/* Author row */}
      <div className="flex items-center justify-between px-4 py-3">
        <Link to={`/profile/${post.author._id}`} className="flex items-center gap-3">
          <Avatar
            src={post.author.avatarUrl}
            name={post.author.displayName || post.author.username}
            size={32}
          />
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm text-foreground leading-tight">
                {post.author.username}
              </span>
              {post.author.isVerified && <VerifiedBadge size={14} />}
            </div>
            <span className="text-xs text-muted-foreground">{formatTime(post.createdAt)}</span>
          </div>
        </Link>
        <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Media */}
      <div className="relative bg-muted aspect-square overflow-hidden">
        {post.type === "video" ? (
          <video
            src={post.mediaUrl}
            poster={post.thumbnailUrl}
            controls
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={post.mediaUrl}
            alt={post.caption}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={cn(
                "flex items-center gap-1.5 transition-all",
                liked ? "text-destructive" : "text-foreground hover:text-muted-foreground"
              )}
            >
              <Heart
                size={24}
                strokeWidth={1.5}
                className={cn(
                  "transition-transform",
                  likeAnimating && "scale-125",
                  liked && "fill-current"
                )}
              />
            </button>
            <button
              onClick={() => onComment?.(post._id)}
              className="text-foreground hover:text-muted-foreground transition-colors"
            >
              <MessageCircle size={24} strokeWidth={1.5} />
            </button>
            <button
              onClick={handleShare}
              className="text-foreground hover:text-muted-foreground transition-colors"
            >
              <Share2 size={24} strokeWidth={1.5} />
            </button>
          </div>
          <button
            onClick={handleSave}
            className={cn(
              "transition-colors",
              saved ? "text-primary" : "text-foreground hover:text-muted-foreground"
            )}
          >
            <Bookmark size={24} strokeWidth={1.5} className={saved ? "fill-current" : ""} />
          </button>
        </div>

        {/* Likes count */}
        {likes > 0 && (
          <p className="text-sm font-semibold text-foreground mb-1">{formatCount(likes)} likes</p>
        )}

        {/* Caption */}
        {post.caption && (
          <p className="text-sm text-foreground leading-snug mb-1">
            <Link to={`/profile/${post.author._id}`} className="font-semibold mr-1 hover:text-primary transition-colors">
              {post.author.username}
            </Link>
            {post.caption.split(/(#\w+)/g).map((part, i) =>
              part.startsWith("#") ? (
                <Link key={i} to={`/explore?hashtag=${part.slice(1)}`} className="text-primary font-medium">
                  {part}
                </Link>
              ) : part
            )}
          </p>
        )}

        {/* Comments link */}
        {post.commentsCount > 0 && (
          <button
            onClick={() => onComment?.(post._id)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all {formatCount(post.commentsCount)} comments
          </button>
        )}
      </div>
    </article>
  );
}
