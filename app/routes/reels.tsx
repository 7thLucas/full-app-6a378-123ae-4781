import { useEffect, useRef, useState, useCallback } from "react";
import { Link, redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Heart, MessageCircle, Share2, Volume2, VolumeX, ChevronUp, ChevronDown } from "lucide-react";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { useAuth } from "~/modules/authentication/use-authentication";
import { useReels } from "~/lumora/hooks/useSocial";
import { Avatar } from "~/lumora/components/Avatar";
import { VerifiedBadge } from "~/lumora/components/VerifiedBadge";
import { BottomNav } from "~/lumora/components/BottomNav";
import { cn } from "~/lib/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return { user };
}

function ReelItem({
  reel,
  isActive,
  muted,
  onToggleMute,
}: {
  reel: any;
  isActive: boolean;
  muted: boolean;
  onToggleMute: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [liked, setLiked] = useState(reel.isLiked ?? false);
  const [likes, setLikes] = useState(reel.likesCount ?? 0);
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
      setPlaying(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes((prev: number) => newLiked ? prev + 1 : prev - 1);
    if (newLiked) { setLikeAnimating(true); setTimeout(() => setLikeAnimating(false), 400); }
    fetch(`/api/social/posts/${reel._id}/like`, { method: newLiked ? "POST" : "DELETE" }).catch(() => {});
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: reel.caption, url: `/posts/${reel._id}` }).catch(() => {});
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) { videoRef.current.play(); setPlaying(true); }
      else { videoRef.current.pause(); setPlaying(false); }
    }
  };

  return (
    <div className="relative w-full h-full flex-shrink-0 bg-black overflow-hidden">
      {/* Video */}
      {reel.mediaUrl ? (
        <video
          ref={videoRef}
          src={reel.mediaUrl}
          loop
          playsInline
          muted={muted}
          className="w-full h-full object-cover"
          onClick={togglePlayPause}
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center" onClick={togglePlayPause}>
          <img src={reel.thumbnailUrl} alt={reel.caption} className="w-full h-full object-cover opacity-60" />
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 pointer-events-none" />

      {/* Paused indicator */}
      {!playing && isActive && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-black/40 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M5 3l14 9-14 9z" />
            </svg>
          </div>
        </div>
      )}

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-16 p-4 pointer-events-none">
        <Link
          to={`/profile/${reel.author?._id}`}
          className="flex items-center gap-2 mb-2 pointer-events-auto"
        >
          <Avatar src={reel.author?.avatarUrl} name={reel.author?.username} size={32} />
          <span className="font-semibold text-white text-sm">{reel.author?.username}</span>
          {reel.author?.isVerified && <VerifiedBadge size={14} />}
        </Link>
        {reel.caption && (
          <p className="text-white text-sm leading-snug line-clamp-2">{reel.caption}</p>
        )}
        {reel.hashtags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {reel.hashtags.slice(0, 3).map((tag: string) => (
              <span key={tag} className="text-primary text-xs font-medium">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Right actions */}
      <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6">
        <button onClick={handleLike} className="flex flex-col items-center gap-1">
          <Heart
            size={28}
            className={cn(
              "transition-transform",
              likeAnimating && "scale-125",
              liked ? "text-red-500 fill-red-500" : "text-white"
            )}
          />
          <span className="text-white text-xs font-semibold">{likes}</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <MessageCircle size={28} className="text-white" />
          <span className="text-white text-xs font-semibold">{reel.commentsCount ?? 0}</span>
        </button>
        <button onClick={handleShare} className="flex flex-col items-center gap-1">
          <Share2 size={28} className="text-white" />
          <span className="text-white text-xs font-semibold">Share</span>
        </button>
        <button onClick={onToggleMute}>
          {muted ? <VolumeX size={28} className="text-white" /> : <Volume2 size={28} className="text-white" />}
        </button>
      </div>
    </div>
  );
}

export default function ReelsPage() {
  const { reels, loading, hasMore, nextCursor, fetchReels } = useReels();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      fetchReels();
    }
  }, []);

  useEffect(() => {
    if (reels.length > 0 && currentIndex >= reels.length - 2 && hasMore && !loading) {
      fetchReels(nextCursor ?? undefined);
    }
  }, [currentIndex, reels.length, hasMore, loading]);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const index = Math.round(container.scrollTop / window.innerHeight);
    setCurrentIndex(index);
  }, []);

  const goNext = () => {
    const container = containerRef.current;
    if (container && currentIndex < reels.length - 1) {
      container.scrollTo({ top: (currentIndex + 1) * window.innerHeight, behavior: "smooth" });
    }
  };

  const goPrev = () => {
    const container = containerRef.current;
    if (container && currentIndex > 0) {
      container.scrollTo({ top: (currentIndex - 1) * window.innerHeight, behavior: "smooth" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden" style={{ zIndex: 40 }}>
      {/* Scroll container */}
      <div
        ref={containerRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollbarWidth: "none" }}
        onScroll={handleScroll}
      >
        {reels.map((reel, idx) => (
          <div key={reel._id} className="snap-start w-full" style={{ height: "100dvh" }}>
            <ReelItem
              reel={reel}
              isActive={idx === currentIndex}
              muted={muted}
              onToggleMute={() => setMuted(m => !m)}
            />
          </div>
        ))}

        {loading && reels.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
          </div>
        )}

        {!loading && reels.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-white gap-4">
            <p className="text-lg font-semibold">No reels yet</p>
            <p className="text-white/60 text-sm">Be the first to share a reel!</p>
          </div>
        )}
      </div>

      {/* Navigation arrows */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
        {currentIndex > 0 && (
          <button onClick={goPrev} className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center">
            <ChevronUp size={20} className="text-white" />
          </button>
        )}
        {currentIndex < reels.length - 1 && (
          <button onClick={goNext} className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center">
            <ChevronDown size={20} className="text-white" />
          </button>
        )}
      </div>

      {/* Bottom nav */}
      <div className="absolute bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </div>
    </div>
  );
}
