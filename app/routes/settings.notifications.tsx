import { useState } from "react";
import { Link, redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { ArrowLeft } from "lucide-react";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
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

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState({
    likes: true,
    comments: true,
    follows: true,
    dms: true,
    mentions: true,
    stories: true,
    emailDigest: false,
  });

  const toggle = (key: keyof typeof settings) => setSettings(s => ({ ...s, [key]: !s[key] }));

  const items = [
    { key: "likes" as const, label: "Likes", desc: "When someone likes your post" },
    { key: "comments" as const, label: "Comments", desc: "When someone comments on your post" },
    { key: "follows" as const, label: "New followers", desc: "When someone follows you" },
    { key: "dms" as const, label: "Direct messages", desc: "When you receive a new message" },
    { key: "mentions" as const, label: "Mentions", desc: "When someone mentions you" },
    { key: "stories" as const, label: "Story views", desc: "When someone views your story" },
    { key: "emailDigest" as const, label: "Weekly email digest", desc: "Summary of your activity" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-navbar border-b border-border px-4 flex items-center gap-3 h-14">
        <Link to="/settings" className="p-1 -ml-1 text-foreground hover:text-muted-foreground">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="font-semibold text-foreground">Notifications</h1>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {items.map((item, i) => (
            <div key={item.key} className={cn("flex items-center justify-between px-4 py-4", i < items.length - 1 && "border-b border-border")}>
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <Toggle enabled={settings[item.key]} onChange={() => toggle(item.key)} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
