import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Moon, Sun, Shield, Bell, Lock, User, LogOut, ChevronRight, BadgeCheck, AlertTriangle } from "lucide-react";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { useAuth } from "~/modules/authentication/use-authentication";
import { useTheme } from "next-themes";
import { useConfigurables } from "~/modules/configurables";
import { cn } from "~/lib/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return { user };
}

interface SettingsItem {
  icon: any;
  label: string;
  href?: string;
  onClick?: () => void;
  rightLabel?: string;
  rightElement?: React.ReactNode;
  destructive?: boolean;
}

function SettingsSection({ title, items }: { title: string; items: SettingsItem[] }) {
  return (
    <div className="mb-6">
      <h3 className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
      <div className="bg-card rounded-2xl mx-4 overflow-hidden border border-border">
        {items.map((item, i) => {
          const Icon = item.icon;
          const content = (
            <div className={cn(
              "flex items-center gap-3 px-4 py-3.5",
              i < items.length - 1 && "border-b border-border",
              item.destructive ? "text-destructive" : "text-foreground"
            )}>
              <Icon size={20} strokeWidth={1.5} className={item.destructive ? "text-destructive" : "text-muted-foreground"} />
              <span className="flex-1 text-sm font-medium">{item.label}</span>
              {item.rightElement ?? (
                item.rightLabel
                  ? <span className="text-sm text-muted-foreground">{item.rightLabel}</span>
                  : <ChevronRight size={16} className="text-muted-foreground" />
              )}
            </div>
          );

          if (item.href) {
            return <Link key={item.label} to={item.href} className="block hover:bg-muted/50 transition-colors">{content}</Link>;
          }
          return (
            <button key={item.label} onClick={item.onClick} className="w-full text-left hover:bg-muted/50 transition-colors">
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { config } = useConfigurables();
  if (!config?.enableDarkMode) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-lg"
    >
      {theme === "dark" ? (
        <Sun size={14} className="text-muted-foreground" />
      ) : (
        <Moon size={14} className="text-muted-foreground" />
      )}
      <span className="text-xs text-muted-foreground">{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { config } = useConfigurables();

  const handleLogout = async () => {
    await fetch("/auth/logout", { method: "POST" });
    navigate("/auth/login");
  };

  const accountItems: SettingsItem[] = [
    { icon: User, label: "Edit Profile", href: "/settings/profile" },
    { icon: Lock, label: "Password & Security", href: "/settings/security" },
    { icon: Bell, label: "Notifications", href: "/settings/notifications" },
    { icon: Lock, label: "Privacy", href: "/settings/privacy" },
  ];

  const verifyItems: SettingsItem[] = [
    { icon: BadgeCheck, label: "Request Verification", href: "/settings/verify" },
    { icon: Shield, label: "Identity Documents", href: "/settings/identity" },
    { icon: AlertTriangle, label: "Report a Problem", href: "/settings/report" },
  ];

  const dangerItems: SettingsItem[] = [
    { icon: LogOut, label: "Log Out", onClick: handleLogout, destructive: true, rightElement: <></> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-navbar border-b border-border px-4 flex items-center justify-between h-14">
        <Link to={`/profile/${user?.id}`} className="p-1 -ml-1 text-foreground hover:text-muted-foreground">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="font-semibold text-foreground">Settings</h1>
        <ThemeToggle />
      </header>

      <main className="max-w-lg mx-auto pb-8 pt-4">
        {/* App name */}
        <div className="px-4 mb-6 text-center">
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {config?.appName ?? "Lumora"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{config?.tagline}</p>
        </div>

        <SettingsSection title="Account" items={accountItems} />
        <SettingsSection title="Trust & Safety" items={verifyItems} />
        <SettingsSection title="Danger Zone" items={dangerItems} />

        {/* App info */}
        <div className="px-4 text-center mt-4">
          <p className="text-xs text-muted-foreground">{config?.footerText ?? `© 2026 ${config?.appName}. All rights reserved.`}</p>
          <p className="text-xs text-muted-foreground mt-1">v1.0.0</p>
        </div>
      </main>
    </div>
  );
}
