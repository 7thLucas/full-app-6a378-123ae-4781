import { useEffect, useState, useRef, useCallback } from "react";
import { Link, redirect, useSearchParams } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Search, X, TrendingUp, Hash } from "lucide-react";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { TopBar } from "~/lumora/components/TopBar";
import { BottomNav } from "~/lumora/components/BottomNav";
import { Avatar } from "~/lumora/components/Avatar";
import { VerifiedBadge } from "~/lumora/components/VerifiedBadge";
import { useSearch } from "~/lumora/hooks/useSocial";
import { cn } from "~/lib/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return { user };
}

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [activeTab, setActiveTab] = useState<"all" | "users" | "posts" | "hashtags">("all");
  const [explorePosts, setExplorePosts] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [exploreLoading, setExploreLoading] = useState(false);
  const { results, loading, search } = useSearch();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    // Load explore grid and trending
    setExploreLoading(true);
    Promise.all([
      fetch("/api/social/explore").then(r => r.json()),
      fetch("/api/social/trending").then(r => r.json()),
    ]).then(([exploreData, trendingData]) => {
      setExplorePosts(exploreData.data ?? []);
      setTrending(trendingData.data ?? []);
    }).catch(console.error).finally(() => setExploreLoading(false));
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (query.trim()) {
      debounceRef.current = setTimeout(() => {
        search(query, activeTab);
        setSearchParams({ q: query });
      }, 400);
    } else {
      setSearchParams({});
    }
  }, [query, activeTab]);

  const isSearching = query.trim().length > 0;

  return (
    <div className="min-h-screen bg-background">
      <TopBar showLogo={false} title="Explore" showActions={false} />

      <main className="max-w-lg mx-auto pb-20">
        {/* Search bar */}
        <div className="px-4 py-3 sticky top-14 z-30 bg-background border-b border-border">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users, posts, hashtags..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-muted rounded-xl pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-all"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            )}
          </div>

          {isSearching && (
            <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar">
              {(["all", "users", "posts", "hashtags"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors",
                    activeTab === tab
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {isSearching ? (
          /* Search results */
          <div>
            {loading && (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            )}

            {/* Users */}
            {(activeTab === "all" || activeTab === "users") && results.users.length > 0 && (
              <div>
                <h3 className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">People</h3>
                {results.users.map((user: any) => (
                  <Link
                    key={user._id}
                    to={`/profile/${user._id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
                  >
                    <Avatar name={user.username} size={48} src={user.avatarUrl} />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-sm text-foreground">{user.username}</span>
                        {user.isVerified && <VerifiedBadge size={14} />}
                      </div>
                      {user.displayName && <p className="text-xs text-muted-foreground">{user.displayName}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Hashtags */}
            {(activeTab === "all" || activeTab === "hashtags") && results.hashtags.length > 0 && (
              <div>
                <h3 className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hashtags</h3>
                {results.hashtags.slice(0, 5).map((post: any) => (
                  <Link
                    key={post._id}
                    to={`/explore?hashtag=${post.hashtags?.[0]}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                      <Hash size={20} className="text-primary" />
                    </div>
                    <span className="font-semibold text-sm text-foreground">#{post.hashtags?.[0]}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Posts */}
            {(activeTab === "all" || activeTab === "posts") && results.posts.length > 0 && (
              <div>
                <h3 className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Posts</h3>
                <div className="grid grid-cols-3 gap-0.5">
                  {results.posts.map((post: any) => (
                    <Link key={post._id} to={`/posts/${post._id}`}>
                      <div className="aspect-square bg-muted overflow-hidden">
                        <img src={post.mediaUrl} alt={post.caption} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {!loading && !results.users.length && !results.posts.length && !results.hashtags.length && (
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <Search size={48} className="text-muted-foreground mb-3 opacity-50" />
                <p className="text-foreground font-semibold">No results for "{query}"</p>
                <p className="text-muted-foreground text-sm mt-1">Try a different search term.</p>
              </div>
            )}
          </div>
        ) : (
          /* Default explore view */
          <>
            {/* Trending hashtags */}
            {trending.length > 0 && (
              <div className="py-4 border-b border-border">
                <div className="flex items-center gap-2 px-4 mb-3">
                  <TrendingUp size={16} className="text-primary" />
                  <h3 className="font-semibold text-sm text-foreground">Trending</h3>
                </div>
                <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar">
                  {trending.slice(0, 10).map((tag: any, i: number) => (
                    <button
                      key={tag._id}
                      onClick={() => setQuery(`#${tag._id}`)}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Hash size={12} />
                      {tag._id}
                      <span className="text-xs opacity-60">{tag.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Explore grid */}
            {exploreLoading ? (
              <div className="grid grid-cols-3 gap-0.5 mt-0.5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-muted animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-0.5">
                {explorePosts.map((post: any, i: number) => (
                  <Link key={post._id} to={`/posts/${post._id}`}>
                    <div
                      className={cn(
                        "aspect-square bg-muted overflow-hidden relative",
                        i % 7 === 0 && "col-span-2 row-span-2"
                      )}
                    >
                      <img
                        src={post.mediaUrl}
                        alt={post.caption}
                        className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                        loading="lazy"
                      />
                      {post.type === "video" && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
                            <path d="M2 1.5l7 3.5-7 3.5z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
