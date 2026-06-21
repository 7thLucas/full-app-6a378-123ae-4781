import { useEffect, useRef, useCallback } from "react";
import { Link, redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { useAuth } from "~/modules/authentication/use-authentication";
import { useConfigurables } from "~/modules/configurables";
import { TopBar } from "~/lumora/components/TopBar";
import { BottomNav } from "~/lumora/components/BottomNav";
import { StoriesBar } from "~/lumora/components/StoriesBar";
import { PostCard } from "~/lumora/components/PostCard";
import { PostCardSkeleton } from "~/lumora/components/SkeletonCard";
import { useFeed } from "~/lumora/hooks/useSocial";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return { user };
}

export default function HomePage() {
  const { user } = useAuth();
  const { config } = useConfigurables();
  const { posts, loading, hasMore, nextCursor, fetchFeed, likePost, savePost } = useFeed();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      fetchFeed();
    }
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading && nextCursor) {
      fetchFeed(nextCursor);
    }
  }, [hasMore, loading, nextCursor, fetchFeed]);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    observerRef.current = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) handleLoadMore(); },
      { threshold: 0.1 }
    );
    observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [handleLoadMore]);

  const isEmpty = !loading && posts.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <main className="max-w-lg mx-auto pb-20">
        {/* Stories placeholder bar */}
        <StoriesBar
          storyGroups={[]}
          currentUserId={user?.id}
          currentUsername={user?.username}
        />

        {/* Feed */}
        {loading && posts.length === 0 && (
          <>
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </>
        )}

        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div
              className="w-20 h-20 rounded-full mb-6 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7C3AED20 0%, #4F46E520 50%, #06B6D420 100%)" }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Your feed is empty</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Follow creators to see their posts here.
            </p>
            <Link
              to="/explore"
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
            >
              Discover people
            </Link>
          </div>
        )}

        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            currentUserId={user?.id}
            onLike={likePost}
            onSave={savePost}
          />
        ))}

        {/* Load more sentinel */}
        <div ref={loadMoreRef} className="h-8" />

        {loading && posts.length > 0 && (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <div className="py-8 text-center text-muted-foreground text-sm">
            You're all caught up!
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
