import { useState, useCallback } from "react";

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!data.success) throw new Error(data.error ?? "Request failed");
  return data;
}

export function useFeed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchFeed = useCallback(async (cursor?: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const url = cursor ? `/api/social/feed?cursor=${cursor}` : `/api/social/feed`;
      const data = await apiFetch(url);
      if (cursor) {
        setPosts(prev => [...prev, ...(data.data ?? [])]);
      } else {
        setPosts(data.data ?? []);
      }
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore ?? false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const likePost = useCallback(async (postId: string, liked: boolean) => {
    try {
      if (liked) {
        await apiFetch(`/api/social/posts/${postId}/like`, { method: "POST" });
      } else {
        await apiFetch(`/api/social/posts/${postId}/like`, { method: "DELETE" });
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const savePost = useCallback(async (postId: string, saved: boolean) => {
    try {
      if (saved) {
        await apiFetch(`/api/social/posts/${postId}/save`, { method: "POST" });
      } else {
        await apiFetch(`/api/social/posts/${postId}/save`, { method: "DELETE" });
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return { posts, loading, nextCursor, hasMore, fetchFeed, likePost, savePost };
}

export function useReels() {
  const [reels, setReels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchReels = useCallback(async (cursor?: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const url = cursor ? `/api/social/reels?cursor=${cursor}` : `/api/social/reels`;
      const data = await apiFetch(url);
      if (cursor) {
        setReels(prev => [...prev, ...(data.data ?? [])]);
      } else {
        setReels(data.data ?? []);
      }
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore ?? false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return { reels, loading, nextCursor, hasMore, fetchReels };
}

export function useProfile(userId: string) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/api/social/profile/${userId}`);
      setProfile(data.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateProfile = useCallback(async (updates: Record<string, any>) => {
    try {
      const data = await apiFetch("/api/social/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      setProfile(data.data);
      return data.data;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }, []);

  const followUser = useCallback(async () => {
    try {
      await apiFetch(`/api/social/follow/${userId}`, { method: "POST" });
      setProfile((prev: any) => prev ? { ...prev, isFollowing: true, followersCount: (prev.followersCount ?? 0) + 1 } : prev);
    } catch (e) {
      console.error(e);
    }
  }, [userId]);

  const unfollowUser = useCallback(async () => {
    try {
      await apiFetch(`/api/social/follow/${userId}`, { method: "DELETE" });
      setProfile((prev: any) => prev ? { ...prev, isFollowing: false, followersCount: Math.max(0, (prev.followersCount ?? 0) - 1) } : prev);
    } catch (e) {
      console.error(e);
    }
  }, [userId]);

  return { profile, loading, error, fetchProfile, updateProfile, followUser, unfollowUser };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/social/notifications");
      setNotifications(data.data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await apiFetch("/api/social/notifications/read", { method: "PUT" });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  }, []);

  return { notifications, loading, unreadCount, fetchNotifications, markAllRead };
}

export function useMessages() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/social/messages");
      setConversations(data.data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const data = await apiFetch(`/api/social/messages/${userId}`);
      setMessages(data.data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (userId: string, text: string) => {
    try {
      const data = await apiFetch(`/api/social/messages/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      setMessages(prev => [...prev, data.data]);
      return data.data;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }, []);

  return { conversations, messages, loading, fetchConversations, fetchMessages, sendMessage };
}

export function useSearch() {
  const [results, setResults] = useState<{ users: any[]; posts: any[]; hashtags: any[] }>({ users: [], posts: [], hashtags: [] });
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (query: string, type = "all") => {
    if (!query.trim()) {
      setResults({ users: [], posts: [], hashtags: [] });
      return;
    }
    setLoading(true);
    try {
      const data = await apiFetch(`/api/social/search?q=${encodeURIComponent(query)}&type=${type}`);
      setResults(data.data ?? { users: [], posts: [], hashtags: [] });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, search };
}
