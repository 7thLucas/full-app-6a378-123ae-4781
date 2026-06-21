import { cn } from "~/lib/utils";

interface VerifiedBadgeProps {
  size?: number;
  className?: string;
}

export function VerifiedBadge({ size = 16, className }: VerifiedBadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center justify-center rounded-full flex-shrink-0", className)}
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #06B6D4 100%)",
      }}
      title="Verified account"
    >
      <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 10 10" fill="none">
        <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
