import { Link, useLocation } from "react-router";
import { Home, Compass, PlusSquare, PlaySquare, User, Bell } from "lucide-react";
import { useAuth } from "~/modules/authentication/use-authentication";
import { useConfigurables } from "~/modules/configurables";
import { cn } from "~/lib/utils";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/explore", icon: Compass, label: "Explore" },
  { href: "/create", icon: PlusSquare, label: "Create", isCreate: true },
  { href: "/reels", icon: PlaySquare, label: "Reels" },
];

export function BottomNav({ unreadNotifications = 0 }: { unreadNotifications?: number }) {
  const location = useLocation();
  const { user } = useAuth();
  const { config } = useConfigurables();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-navbar"
      style={{ height: 60, paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around h-full max-w-lg mx-auto px-2">
        {NAV_ITEMS.map((item) => {
          if (item.isCreate) {
            return (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary text-primary-foreground shadow-md transition-transform active:scale-95"
              >
                <item.icon size={22} strokeWidth={2} />
              </Link>
            );
          }
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 px-3 rounded-lg transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon
                size={24}
                strokeWidth={active ? 2.5 : 1.5}
                className="transition-all"
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* Profile tab */}
        <Link
          to={user ? `/profile/${user.id}` : "/auth/login"}
          className={cn(
            "flex flex-col items-center gap-0.5 py-2 px-3 rounded-lg transition-colors",
            location.pathname.startsWith("/profile") ? "text-primary" : "text-muted-foreground"
          )}
        >
          {user ? (
            <div className="relative w-6 h-6">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border-2 border-primary">
                <User size={14} className="text-primary" />
              </div>
            </div>
          ) : (
            <User size={24} strokeWidth={1.5} />
          )}
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
