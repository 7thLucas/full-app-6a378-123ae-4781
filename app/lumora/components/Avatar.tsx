import { cn } from "~/lib/utils";

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 32 | 48 | 64 | 96 | 128;
  hasStory?: boolean;
  storySeen?: boolean;
  isVerified?: boolean;
  className?: string;
}

const SIZE_MAP: Record<number, string> = {
  32: "w-8 h-8",
  48: "w-12 h-12",
  64: "w-16 h-16",
  96: "w-24 h-24",
  128: "w-32 h-32",
};

function getInitials(name?: string) {
  if (!name) return "?";
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

export function Avatar({ src, name, size = 48, hasStory = false, storySeen = false, isVerified = false, className }: AvatarProps) {
  const sizeClass = SIZE_MAP[size] ?? SIZE_MAP[48];

  return (
    <div className={cn("relative flex-shrink-0", className)}>
      <div
        className={cn(
          "rounded-full overflow-hidden flex items-center justify-center",
          sizeClass,
          hasStory
            ? storySeen
              ? "p-[2px] border-2 border-muted-foreground/40"
              : "p-[2px]"
            : ""
        )}
        style={
          hasStory && !storySeen
            ? {
                background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #06B6D4 100%)",
                padding: "2px",
              }
            : undefined
        }
      >
        <div className={cn("rounded-full overflow-hidden w-full h-full bg-secondary flex items-center justify-center")}>
          {src ? (
            <img src={src} alt={name ?? "Avatar"} className="w-full h-full object-cover" />
          ) : (
            <span className="text-secondary-foreground font-semibold text-sm select-none">
              {getInitials(name)}
            </span>
          )}
        </div>
      </div>

      {isVerified && (
        <span
          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #06B6D4 100%)" }}
          title="Verified"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </div>
  );
}
