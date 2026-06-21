import { useState, useRef } from "react";
import { Link, redirect, useNavigate, useSearchParams } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { ArrowLeft, Image, Video, Film, Camera, X, Hash, Plus } from "lucide-react";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { useAuth } from "~/modules/authentication/use-authentication";
import { useConfigurables } from "~/modules/configurables";
import { cn } from "~/lib/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return { user };
}

type PostType = "photo" | "video" | "reel" | "story";

const POST_TYPES: { value: PostType; label: string; icon: any; description: string }[] = [
  { value: "photo", label: "Photo", icon: Image, description: "Share a photo" },
  { value: "video", label: "Video", icon: Video, description: "Share a video" },
  { value: "reel", label: "Reel", icon: Film, description: "Short vertical video" },
  { value: "story", label: "Story", icon: Camera, description: "24-hour disappearing post" },
];

export default function CreatePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { config } = useConfigurables();

  const initialType = (searchParams.get("type") as PostType) ?? "photo";
  const [postType, setPostType] = useState<PostType>(initialType);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxCaption = config?.maxPostCaptionLength ?? 2200;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreview(url);
  };

  const addHashtag = () => {
    const tag = hashtag.replace(/^#/, "").trim();
    if (tag && !hashtags.includes(tag)) {
      setHashtags(prev => [...prev, tag]);
    }
    setHashtag("");
  };

  const removeHashtag = (tag: string) => {
    setHashtags(prev => prev.filter(h => h !== tag));
  };

  const handleSubmit = async () => {
    if (!file) { setError("Please select a file."); return; }
    setUploading(true);
    setError(null);
    try {
      // Upload file
      const fileType = file.type.startsWith("video") ? "document" : "image";
      const form = new FormData();
      form.append("file", file);
      const uploadRes = await fetch(`/api/uploader/${fileType}`, { method: "POST", body: form });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error(uploadData.error ?? "Upload failed");

      // Create post
      const postRes = await fetch("/api/social/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: postType,
          mediaUrl: uploadData.data.url,
          caption: caption.trim(),
          hashtags,
        }),
      });
      const postData = await postRes.json();
      if (!postData.success) throw new Error(postData.error ?? "Failed to create post");

      if (postType === "reel") {
        navigate("/reels");
      } else if (postType === "story") {
        navigate("/");
      } else {
        navigate(`/profile/${user?.id}`);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-navbar border-b border-border px-4 flex items-center justify-between h-14">
        <Link to="/" className="p-1 -ml-1 text-foreground hover:text-muted-foreground">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="font-semibold text-foreground">New Post</h1>
        <button
          onClick={handleSubmit}
          disabled={!file || uploading}
          className="text-primary font-semibold text-sm disabled:opacity-40 hover:opacity-70 transition-opacity"
        >
          {uploading ? "Posting..." : "Share"}
        </button>
      </header>

      <main className="max-w-lg mx-auto pb-8 px-4">
        {/* Post type selector */}
        <div className="grid grid-cols-4 gap-2 mt-4 mb-5">
          {POST_TYPES.map(type => (
            <button
              key={type.value}
              onClick={() => { setPostType(type.value); setFile(null); setPreview(null); }}
              className={cn(
                "flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all",
                postType === type.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40"
              )}
            >
              <type.icon size={22} strokeWidth={1.5} />
              <span className="text-xs font-medium">{type.label}</span>
            </button>
          ))}
        </div>

        {/* File upload area */}
        {!preview ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-square border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7C3AED20 0%, #4F46E520 100%)" }}
            >
              <Image size={28} className="text-primary" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">Choose {postType === "photo" ? "a photo" : "a video"}</p>
              <p className="text-sm text-muted-foreground mt-1">Tap to browse your device</p>
            </div>
          </button>
        ) : (
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black">
            {postType === "video" || postType === "reel" ? (
              <video src={preview} controls className="w-full h-full object-cover" />
            ) : (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            )}
            <button
              onClick={() => { setFile(null); setPreview(null); }}
              className="absolute top-3 right-3 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={postType === "photo" || postType === "story" ? "image/*" : "video/*"}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Caption */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-foreground mb-1.5">Caption</label>
          <textarea
            value={caption}
            onChange={e => setCaption(e.target.value.slice(0, maxCaption))}
            placeholder="Write a caption..."
            rows={3}
            className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          <p className="text-right text-xs text-muted-foreground mt-1">{caption.length}/{maxCaption}</p>
        </div>

        {/* Hashtags */}
        <div className="mt-3">
          <label className="block text-sm font-medium text-foreground mb-1.5">Hashtags</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={hashtag}
                onChange={e => setHashtag(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                onKeyDown={e => e.key === "Enter" && addHashtag()}
                placeholder="add hashtag"
                className="w-full bg-muted rounded-xl pl-8 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              onClick={addHashtag}
              className="px-3 py-2 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90"
            >
              <Plus size={18} />
            </button>
          </div>
          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {hashtags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2.5 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
                >
                  #{tag}
                  <button onClick={() => removeHashtag(tag)} className="hover:text-destructive">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-xl">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!file || uploading}
          className="w-full mt-6 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition-all"
          style={{ background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)" }}
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              Sharing...
            </span>
          ) : (
            `Share ${postType.charAt(0).toUpperCase() + postType.slice(1)}`
          )}
        </button>
      </main>
    </div>
  );
}
