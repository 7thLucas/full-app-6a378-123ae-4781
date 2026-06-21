import { useEffect, useState } from "react";
import { Link, redirect, useParams } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { ArrowLeft } from "lucide-react";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { Avatar } from "~/lumora/components/Avatar";
import { VerifiedBadge } from "~/lumora/components/VerifiedBadge";
import { BottomNav } from "~/lumora/components/BottomNav";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return { user };
}

export default function FollowingPage() {
  const params = useParams();
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/social/following/${params.userId}`)
      .then(r => r.json())
      .then(d => setFollowing(d.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.userId]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-navbar border-b border-border px-4 flex items-center gap-3 h-14">
        <Link to={-1 as any} className="p-1 -ml-1 text-foreground">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="font-semibold text-foreground">Following</h1>
      </header>
      <main className="max-w-lg mx-auto pb-20">
        {loading && <div className="flex justify-center py-8"><div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>}
        {!loading && following.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">Not following anyone yet.</div>
        )}
        {following.map((user: any) => (
          <Link key={user._id} to={`/profile/${user._id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50">
            <Avatar src={user.avatarUrl} name={user.username} size={48} isVerified={user.isVerified} />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-sm text-foreground">{user.username}</span>
                {user.isVerified && <VerifiedBadge size={14} />}
              </div>
              {user.displayName && <p className="text-xs text-muted-foreground">{user.displayName}</p>}
            </div>
          </Link>
        ))}
      </main>
      <BottomNav />
    </div>
  );
}
