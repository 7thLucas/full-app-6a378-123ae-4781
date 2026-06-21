import { useState } from "react";
import { Link, redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { ArrowLeft } from "lucide-react";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { useAuth } from "~/modules/authentication/use-authentication";
import { useProfile } from "~/lumora/hooks/useSocial";
import { cn } from "~/lib/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return { user };
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn("relative w-11 h-6 rounded-full transition-colors flex-shrink-0", enabled ? "bg-primary" : "bg-muted-foreground/30")}
    >
      <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform", enabled ? "translate-x-6" : "translate-x-1")} />
    </button>
  );
}

export default function PrivacySettingsPage() {
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile(user?.id ?? "");
  const [publicAccount, setPublicAccount] = useState(profile?.isPublic ?? true);
  const [saving, setSaving] = useState(false);

  const handleTogglePublic = async () => {
    const newVal = !publicAccount;
    setPublicAccount(newVal);
    setSaving(true);
    try {
      await updateProfile({ isPublic: newVal });
    } catch {
      setPublicAccount(!newVal);
    } finally {
      setSaving(false);
    }
  };

  const items = [
    {
      label: "Public account",
      desc: "Anyone can see your posts and profile",
      enabled: publicAccount,
      onChange: handleTogglePublic,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-navbar border-b border-border px-4 flex items-center gap-3 h-14">
        <Link to="/settings" className="p-1 -ml-1 text-foreground hover:text-muted-foreground">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="font-semibold text-foreground">Privacy</h1>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-card rounded-2xl border border-border overflow-hidden mb-6">
          {items.map((item, i) => (
            <div key={item.label} className="flex items-center justify-between px-4 py-4">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <Toggle enabled={item.enabled} onChange={item.onChange} />
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <h3 className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">Connections</h3>
          <Link to="/settings" className="flex items-center justify-between px-4 py-3.5 hover:bg-muted/50">
            <span className="text-sm font-medium text-foreground">Blocked accounts</span>
            <span className="text-xs text-muted-foreground">→</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
