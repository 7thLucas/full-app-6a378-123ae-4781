import { useEffect, useState } from "react";
import { Link, redirect, useParams } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Grid3X3, Bookmark, Settings, MoreHorizontal, UserPlus, UserCheck, MessageCircle } from "lucide-react";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { useAuth } from "~/modules/authentication/use-authentication";
import { TopBar } from "~/lumora/components/TopBar";
import { BottomNav } from "~/lumora/components/BottomNav";
import { Avatar } from "~/lumora/components/Avatar";
import { VerifiedBadge } from "~/lumora/components/VerifiedBadge";
import { ProfileSkeleton } from "~/lumora/components/SkeletonCard";
import { useProfile } from "~/lumora/hooks/useSocial";
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

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId ?? "";
  const { user: currentUser } = useAuth();
  const { profile, loading, error, fetchProfile, followUser, unfollowUser } = useProfile(userId);
  const [posts, setPosts] = useState<any[]>([]);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  const [postsLoading, setPostsLoading] = useState(false);

  const isOwn = currentUser?.id === userId;

  useEffect(() => {
    if (userId) fetchProfile();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    setPostsLoading(true);
    fetch(`/api/social/users/${userId}/posts`).then(r => r.json()).then(d => {
      setPosts(d.data ?? []);
    }).catch(console.error).finally(() => setPostsLoading(false));
  }, [userId]);

  useEffect(() => {
    if (!isOwn || activeTab !== "saved") return;
    fetch("/api/social/saved").then(r => r.json()).then(d => {
      setSavedPosts(d.data ?? []);
    }).catch(console.error);
  }, [isOwn, activeTab]);

  const displayPosts = activeTab === "saved" ? savedPosts : posts;

  if (loading) return (
    <div className="min-h-screen bg-background">
      <TopBar showLogo={false} title="Profile" showActions={false} />
      <ProfileSkeleton />
      <BottomNav />
    </div>
  );

  if (error || !profile) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Profile not found.</p>
        <Link to="/" className="text-primary font-semibold text-sm mt-2 inline-block">Go home</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <TopBar
        showLogo={false}
        title={profile.username ?? "Profile"}
        showActions={false}
        rightAction={
          isOwn ? (
            <Link to="/settings" className="p-2 text-foreground hover:text-muted-foreground">
              <Settings size={22} strokeWidth={1.5} />
            </Link>
          ) : (
            <button className="p-2 text-foreground hover:text-muted-foreground">
              <MoreHorizontal size={22} />
            </button>
          )
        }
      />

      <main className="max-w-lg mx-auto pb-20">
        {/* Profile header */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-start gap-6 mb-4">
            <Avatar
              src={profile.avatarUrl}
              name={profile.displayName || profile.username}
              size={96}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-bold text-lg text-foreground truncate">{profile.username}</h1>
                {profile.isVerified && <VerifiedBadge size={18} />}
              </div>

              {/* Stats */}
              <div className="flex gap-4 mb-3">
                <div className="text-center">
                  <div className="font-bold text-base text-foreground">{formatCount(profile.postsCount ?? 0)}</div>
                  <div className="text-xs text-muted-foreground">posts</div>
                </div>
                <Link to={`/followers/${userId}`} className="text-center hover:opacity-70 transition-opacity">
                  <div className="font-bold text-base text-foreground">{formatCount(profile.followersCount ?? 0)}</div>
                  <div className="text-xs text-muted-foreground">followers</div>
                </Link>
                <Link to={`/following/${userId}`} className="text-center hover:opacity-70 transition-opacity">
                  <div className="font-bold text-base text-foreground">{formatCount(profile.followingCount ?? 0)}</div>
                  <div className="text-xs text-muted-foreground">following</div>
                </Link>
              </div>

              {/* Action buttons */}
              {isOwn ? (
                <Link
                  to="/settings/profile"
                  className="block w-full text-center py-1.5 px-4 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Edit profile
                </Link>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => profile.isFollowing ? unfollowUser() : followUser()}
                    className={cn(
                      "flex-1 py-1.5 rounded-xl text-sm font-semibold transition-colors",
                      profile.isFollowing
                        ? "border border-border text-foreground hover:bg-muted"
                        : "bg-primary text-primary-foreground hover:opacity-90"
                    )}
                  >
                    {profile.isFollowing ? "Following" : "Follow"}
                  </button>
                  <Link
                    to={`/messages/${userId}`}
                    className="flex-1 py-1.5 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-muted text-center transition-colors"
                  >
                    Message
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          {profile.displayName && (
            <p className="font-semibold text-sm text-foreground mb-0.5">{profile.displayName}</p>
          )}
          {profile.bio && (
            <p className="text-sm text-foreground whitespace-pre-line mb-1">{profile.bio}</p>
          )}
          {profile.website && (
            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary font-medium">
              {profile.website.replace(/^https?:\/\//, "")}
            </a>
          )}

          {/* Verification status */}
          {profile.verificationStatus === "pending" && (
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
              Verification pending review
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-t border-border flex">
          <button
            onClick={() => setActiveTab("posts")}
            className={cn(
              "flex-1 py-3 flex items-center justify-center gap-2 text-sm font-semibold border-b-2 transition-colors",
              activeTab === "posts" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            )}
          >
            <Grid3X3 size={18} />
            Posts
          </button>
          {isOwn && (
            <button
              onClick={() => setActiveTab("saved")}
              className={cn(
                "flex-1 py-3 flex items-center justify-center gap-2 text-sm font-semibold border-b-2 transition-colors",
                activeTab === "saved" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
              )}
            >
              <Bookmark size={18} />
              Saved
            </button>
          )}
        </div>

        {/* Posts grid */}
        {postsLoading ? (
          <div className="grid grid-cols-3 gap-0.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="aspect-square bg-muted animate-pulse" />
            ))}
          </div>
        ) : displayPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <Grid3X3 size={40} className="text-muted-foreground mb-3 opacity-50" />
            <p className="text-foreground font-semibold">
              {activeTab === "saved" ? "No saved posts" : "No posts yet"}
            </p>
            {isOwn && activeTab === "posts" && (
              <Link to="/create" className="mt-4 px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold">
                Create post
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-0.5">
            {displayPosts.map((post: any) => (
              <Link key={post._id} to={`/posts/${post._id}`}>
                <div className="aspect-square bg-muted overflow-hidden relative">
                  <img
                    src={post.mediaUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                    loading="lazy"
                  />
                  {post.type === "video" && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center">
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="white">
                        <path d="M2 1.5l7 3.5-7 3.5z" />
                      </svg>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
