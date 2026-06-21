import { useState, useEffect, useRef } from "react";
import { Link, redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { ArrowLeft, Camera } from "lucide-react";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { useAuth } from "~/modules/authentication/use-authentication";
import { useConfigurables } from "~/modules/configurables";
import { Avatar } from "~/lumora/components/Avatar";
import { useProfile } from "~/lumora/hooks/useSocial";
import { cn } from "~/lib/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return { user };
}

export default function EditProfilePage() {
  const { user } = useAuth();
  const { config } = useConfigurables();
  const { profile, loading, fetchProfile, updateProfile } = useProfile(user?.id ?? "");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxBio = config?.maxBioLength ?? 150;

  useEffect(() => {
    if (user?.id) fetchProfile();
  }, [user?.id]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName ?? "");
      setBio(profile.bio ?? "");
      setWebsite(profile.website ?? "");
    }
  }, [profile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      let avatarUrl = profile?.avatarUrl;
      if (avatarFile) {
        const form = new FormData();
        form.append("file", avatarFile);
        const uploadRes = await fetch("/api/uploader/image", { method: "POST", body: form });
        const uploadData = await uploadRes.json();
        if (!uploadData.success) throw new Error("Failed to upload avatar");
        avatarUrl = uploadData.data.url;
      }
      await updateProfile({ displayName, bio, website, avatarUrl });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-navbar border-b border-border px-4 flex items-center justify-between h-14">
        <Link to="/settings" className="p-1 -ml-1 text-foreground hover:text-muted-foreground">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="font-semibold text-foreground">Edit Profile</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="text-primary font-semibold text-sm disabled:opacity-40 hover:opacity-70"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <Avatar
              src={avatarPreview ?? profile?.avatarUrl}
              name={profile?.displayName || profile?.username}
              size={96}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground border-2 border-card"
            >
              <Camera size={14} />
            </button>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 text-primary text-sm font-semibold hover:opacity-70"
          >
            Change photo
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Display name</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Your full name"
              className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Bio
              <span className="text-muted-foreground font-normal ml-1">({bio.length}/{maxBio})</span>
            </label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value.slice(0, maxBio))}
              placeholder="Tell people about yourself..."
              rows={3}
              className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Website</label>
            <input
              type="url"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Feedback */}
        {success && (
          <div className="mt-4 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl">
            <p className="text-green-600 dark:text-green-400 text-sm font-medium">Profile updated successfully!</p>
          </div>
        )}
        {error && (
          <div className="mt-4 px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-xl">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-6 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition-all"
        >
          {saving ? "Saving changes..." : "Save changes"}
        </button>
      </main>
    </div>
  );
}
