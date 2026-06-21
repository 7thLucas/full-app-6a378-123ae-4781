import { useRef } from "react";
import { Link } from "react-router";
import { PlusCircle } from "lucide-react";
import { Avatar } from "./Avatar";

interface StoryGroup {
  author: {
    _id: string;
    username: string;
    avatarUrl?: string;
    isVerified?: boolean;
  };
  stories: any[];
}

interface StoriesBarProps {
  storyGroups: StoryGroup[];
  currentUserId?: string;
  currentUserAvatar?: string;
  currentUsername?: string;
}

export function StoriesBar({ storyGroups, currentUserId, currentUserAvatar, currentUsername }: StoriesBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-card border-b border-border">
      <div
        ref={scrollRef}
        className="flex items-center gap-4 px-4 py-3 overflow-x-auto no-scrollbar"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Add story button */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <Link to="/create?type=story" className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
              {currentUserAvatar ? (
                <img src={currentUserAvatar} alt={currentUsername} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <span className="text-secondary-foreground text-lg font-semibold">
                    {currentUsername?.[0]?.toUpperCase() ?? "?"}
                  </span>
                </div>
              )}
            </div>
            <span className="absolute bottom-0 right-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-card">
              <PlusCircle size={12} className="text-primary-foreground" />
            </span>
          </Link>
          <span className="text-[11px] text-muted-foreground font-medium truncate max-w-[64px]">Your story</span>
        </div>

        {/* Story groups */}
        {storyGroups.map((group) => (
          <Link
            key={group.author._id}
            to={`/stories/${group.author._id}`}
            className="flex flex-col items-center gap-1 flex-shrink-0"
          >
            <Avatar
              src={group.author.avatarUrl}
              name={group.author.username}
              size={64}
              hasStory
              storySeen={false}
              isVerified={group.author.isVerified}
            />
            <span className="text-[11px] text-foreground font-medium truncate max-w-[64px]">
              {group.author.username}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
