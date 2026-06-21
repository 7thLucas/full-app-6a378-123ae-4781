import { cn } from "~/lib/utils";

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-muted animate-pulse rounded",
        className
      )}
    />
  );
}

export function PostCardSkeleton() {
  return (
    <div className="bg-card border-b border-border">
      <div className="flex items-center gap-3 px-4 py-3">
        <Shimmer className="w-8 h-8 rounded-full" />
        <div className="flex-1">
          <Shimmer className="h-3 w-24 mb-1 rounded" />
          <Shimmer className="h-2 w-16 rounded" />
        </div>
      </div>
      <Shimmer className="aspect-square w-full" />
      <div className="px-4 pt-3 pb-4">
        <Shimmer className="h-4 w-32 mb-2" />
        <Shimmer className="h-3 w-full mb-1" />
        <Shimmer className="h-3 w-3/4" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="p-4">
      <div className="flex items-center gap-6 mb-6">
        <Shimmer className="w-24 h-24 rounded-full" />
        <div className="flex-1">
          <Shimmer className="h-5 w-32 mb-2" />
          <div className="flex gap-6">
            <Shimmer className="h-3 w-10" />
            <Shimmer className="h-3 w-10" />
            <Shimmer className="h-3 w-10" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-0.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <Shimmer key={i} className="aspect-square w-full" />
        ))}
      </div>
    </div>
  );
}
