import { Link } from "react-router";
import { Bell, MessageCircle, Settings } from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import { cn } from "~/lib/utils";

interface TopBarProps {
  showLogo?: boolean;
  title?: string;
  showActions?: boolean;
  unreadNotifications?: number;
  unreadMessages?: number;
  onSettingsClick?: () => void;
  rightAction?: React.ReactNode;
}

export function TopBar({
  showLogo = true,
  title,
  showActions = true,
  unreadNotifications = 0,
  unreadMessages = 0,
  rightAction,
}: TopBarProps) {
  const { config } = useConfigurables();

  return (
    <header className="sticky top-0 z-40 bg-navbar border-b border-border px-4 flex items-center justify-between h-14">
      <div className="flex-1">
        {showLogo ? (
          <Link to="/" className="flex items-center gap-1.5">
            {config?.logoUrl ? (
              <img src={config.logoUrl} alt={config?.appName ?? "Lumora"} className="h-8 w-auto object-contain" />
            ) : (
              <span
                className="text-2xl font-bold text-foreground"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {config?.appName ?? "Lumora"}
              </span>
            )}
          </Link>
        ) : (
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        )}
      </div>

      {showActions && (
        <div className="flex items-center gap-1">
          <Link
            to="/notifications"
            className="relative p-2 rounded-full hover:bg-muted transition-colors"
          >
            <Bell size={22} className="text-foreground" strokeWidth={1.5} />
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                {unreadNotifications > 99 ? "99+" : unreadNotifications}
              </span>
            )}
          </Link>
          <Link
            to="/messages"
            className="relative p-2 rounded-full hover:bg-muted transition-colors"
          >
            <MessageCircle size={22} className="text-foreground" strokeWidth={1.5} />
            {unreadMessages > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                {unreadMessages > 99 ? "99+" : unreadMessages}
              </span>
            )}
          </Link>
          {rightAction}
        </div>
      )}
    </header>
  );
}
