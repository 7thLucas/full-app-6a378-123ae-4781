import { useEffect, useState, useRef } from "react";
import { Link, redirect, useParams, useNavigate } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { Avatar } from "~/lumora/components/Avatar";
import { VerifiedBadge } from "~/lumora/components/VerifiedBadge";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return { user };
}

export default function StoryViewerPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [stories, setStories] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const STORY_DURATION = 5000;

  useEffect(() => {
    fetch("/api/social/stories")
      .then(r => r.json())
      .then(d => {
        const groups = d.data ?? [];
        // Find the group for this user
        const group = groups.find((g: any) => g.author?._id === params.userId);
        setStories(group?.stories ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.userId]);

  useEffect(() => {
    setProgress(0);
    clearInterval(timerRef.current);
    if (!stories.length) return;

    const step = 100 / (STORY_DURATION / 100);
    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(i => i + 1);
            return 0;
          } else {
            clearInterval(timerRef.current);
            navigate(-1);
            return 100;
          }
        }
        return prev + step;
      });
    }, 100);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, stories.length]);

  const story = stories[currentIndex];

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p>No stories to show</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-white/70 underline text-sm">Go back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 p-3 z-10">
        {stories.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-none"
              style={{ width: i < currentIndex ? "100%" : i === currentIndex ? `${progress}%` : "0%" }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-6 left-0 right-0 flex items-center justify-between px-4 z-10">
        <Link to={`/profile/${story.author?._id}`} className="flex items-center gap-2">
          <Avatar src={story.author?.avatarUrl} name={story.author?.username} size={32} />
          <div>
            <div className="flex items-center gap-1">
              <span className="text-white font-semibold text-sm">{story.author?.username}</span>
              {story.author?.isVerified && <VerifiedBadge size={14} />}
            </div>
          </div>
        </Link>
        <button onClick={() => navigate(-1)} className="text-white">
          <X size={24} />
        </button>
      </div>

      {/* Media */}
      <div className="absolute inset-0">
        {story.type === "video" ? (
          <video src={story.mediaUrl} autoPlay muted loop playsInline className="w-full h-full object-cover" />
        ) : (
          <img src={story.mediaUrl} alt="" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Caption */}
      {story.caption && (
        <div className="absolute bottom-20 left-4 right-4 z-10">
          <p className="text-white text-sm text-center drop-shadow">{story.caption}</p>
        </div>
      )}

      {/* Tap areas */}
      <button
        className="absolute left-0 top-0 bottom-0 w-1/3 z-20"
        onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
      />
      <button
        className="absolute right-0 top-0 bottom-0 w-1/3 z-20"
        onClick={() => {
          if (currentIndex < stories.length - 1) setCurrentIndex(i => i + 1);
          else navigate(-1);
        }}
      />
    </div>
  );
}
