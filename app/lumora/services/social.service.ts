import mongoose from "mongoose";
import { PostModel } from "../models/post.model";
import { ProfileModel } from "../models/profile.model";
import { FollowModel } from "../models/follow.model";
import { LikeModel } from "../models/like.model";
import { CommentModel } from "../models/comment.model";
import { MessageModel } from "../models/message.model";
import { NotificationModel } from "../models/notification.model";
import { ReportModel } from "../models/report.model";
import { UserModel } from "~/modules/authentication/authentication.model";

export class SocialService {
  // ── Profile ────────────────────────────────────────────────────────────────

  static async getOrCreateProfile(userId: string) {
    let profile = await ProfileModel.findOne({ userId });
    if (!profile) {
      const user = await UserModel.findById(userId);
      profile = await ProfileModel.create({
        userId,
        displayName: user?.username ?? "",
      });
    }
    return profile;
  }

  static async getProfile(userId: string, viewerId?: string) {
    const profile = await SocialService.getOrCreateProfile(userId);
    const user = await UserModel.findById(userId).select("username email email_verified");

    let isFollowing = false;
    if (viewerId && viewerId !== userId) {
      const follow = await FollowModel.findOne({ followerId: viewerId, followingId: userId });
      isFollowing = !!follow;
    }

    return {
      ...profile.toObject(),
      username: user?.username,
      email: user?.email,
      emailVerified: user?.email_verified,
      isFollowing,
    };
  }

  static async updateProfile(userId: string, data: Record<string, any>) {
    const allowedFields = ["displayName", "bio", "avatarUrl", "website", "isPublic", "twoFactorEnabled"];
    const update: Record<string, any> = {};
    for (const key of allowedFields) {
      if (data[key] !== undefined) update[key] = data[key];
    }
    const profile = await ProfileModel.findOneAndUpdate(
      { userId },
      { $set: update },
      { new: true, upsert: true }
    );
    return profile;
  }

  // ── Posts ─────────────────────────────────────────────────────────────────

  static async getFeed(userId: string, cursor?: string, limit = 12) {
    const followingDocs = await FollowModel.find({ followerId: userId }).select("followingId");
    const followingIds = followingDocs.map(f => f.followingId);
    followingIds.push(userId as any);

    const query: any = {
      authorId: { $in: followingIds },
      type: { $in: ["photo", "video"] },
      isDeleted: false,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
    };
    if (cursor) query._id = { $lt: new mongoose.Types.ObjectId(cursor) };

    const posts = await PostModel.find(query).sort({ _id: -1 }).limit(limit + 1);
    const hasMore = posts.length > limit;
    const data = hasMore ? posts.slice(0, limit) : posts;
    const nextCursor = hasMore ? data[data.length - 1]._id.toString() : null;

    const enriched = await SocialService.enrichPosts(data.map(p => p.toObject()), userId);
    return { data: enriched, nextCursor, hasMore };
  }

  static async getPost(postId: string, viewerId?: string) {
    const post = await PostModel.findById(postId);
    if (!post || post.isDeleted) throw new Error("Post not found");
    const enriched = await SocialService.enrichPosts([post.toObject()], viewerId);
    return enriched[0];
  }

  static async createPost(userId: string, data: { type: string; mediaUrl: string; caption?: string; hashtags?: string[]; thumbnailUrl?: string }) {
    const post = await PostModel.create({
      authorId: userId,
      type: data.type,
      mediaUrl: data.mediaUrl,
      thumbnailUrl: data.thumbnailUrl ?? "",
      caption: data.caption ?? "",
      hashtags: data.hashtags ?? [],
      expiresAt: data.type === "story" ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null,
    });
    await ProfileModel.findOneAndUpdate({ userId }, { $inc: { postsCount: 1 } }, { upsert: true });
    return post;
  }

  static async deletePost(userId: string, postId: string) {
    const post = await PostModel.findById(postId);
    if (!post) throw new Error("Post not found");
    if (post.authorId !== userId) throw new Error("Unauthorized");
    await PostModel.findByIdAndUpdate(postId, { isDeleted: true });
    await ProfileModel.findOneAndUpdate({ userId }, { $inc: { postsCount: -1 } });
  }

  static async getReels(userId: string, cursor?: string, limit = 10) {
    const query: any = { type: "reel", isDeleted: false };
    if (cursor) query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    const posts = await PostModel.find(query).sort({ _id: -1 }).limit(limit + 1);
    const hasMore = posts.length > limit;
    const data = hasMore ? posts.slice(0, limit) : posts;
    const nextCursor = hasMore ? data[data.length - 1]._id.toString() : null;
    const enriched = await SocialService.enrichPosts(data.map(p => p.toObject()), userId);
    return { data: enriched, nextCursor, hasMore };
  }

  static async getStories(userId: string) {
    const followingDocs = await FollowModel.find({ followerId: userId }).select("followingId");
    const followingIds = followingDocs.map(f => f.followingId);
    followingIds.push(userId as any);

    const stories = await PostModel.find({
      authorId: { $in: followingIds },
      type: "story",
      isDeleted: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    const enriched = await SocialService.enrichPosts(stories.map(p => p.toObject()), userId);
    const grouped: Record<string, any> = {};
    for (const story of enriched) {
      const authorId = story.authorId?.toString();
      if (!grouped[authorId]) {
        grouped[authorId] = { author: story.author, stories: [] };
      }
      grouped[authorId].stories.push(story);
    }
    return Object.values(grouped);
  }

  static async explore(userId: string, cursor?: string, limit = 24) {
    const query: any = { type: { $in: ["photo", "video"] }, isDeleted: false };
    if (cursor) query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    const posts = await PostModel.find(query).sort({ likesCount: -1, _id: -1 }).limit(limit + 1);
    const hasMore = posts.length > limit;
    const data = hasMore ? posts.slice(0, limit) : posts;
    const nextCursor = hasMore ? data[data.length - 1]._id.toString() : null;
    const enriched = await SocialService.enrichPosts(data.map(p => p.toObject()), userId);
    return { data: enriched, nextCursor, hasMore };
  }

  static async search(query: string, type: string) {
    if (!query) return { users: [], posts: [], hashtags: [] };
    const regex = new RegExp(query.replace(/^#/, ""), "i");

    const users = type === "all" || type === "users"
      ? await UserModel.find({ $or: [{ username: regex }, { email: regex }] }).limit(10).select("username email _id")
      : [];

    const posts = type === "all" || type === "posts"
      ? await PostModel.find({ caption: regex, isDeleted: false }).limit(12)
      : [];

    const hashtagPosts = type === "all" || type === "hashtags"
      ? await PostModel.find({ hashtags: regex, isDeleted: false }).limit(12)
      : [];

    return { users, posts, hashtags: hashtagPosts };
  }

  static async getTrending() {
    const posts = await PostModel.aggregate([
      { $match: { isDeleted: false, createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
      { $unwind: "$hashtags" },
      { $group: { _id: "$hashtags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);
    return posts;
  }

  // ── Likes ─────────────────────────────────────────────────────────────────

  static async likePost(userId: string, postId: string) {
    const existing = await LikeModel.findOne({ userId, postId });
    if (existing) return;
    await LikeModel.create({ userId, postId });
    await PostModel.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });
    const post = await PostModel.findById(postId);
    if (post && post.authorId !== userId) {
      const user = await UserModel.findById(userId).select("username");
      await NotificationModel.create({
        userId: post.authorId,
        fromUserId: userId,
        type: "like",
        message: `${user?.username} liked your post`,
        targetId: postId,
      });
    }
  }

  static async unlikePost(userId: string, postId: string) {
    await LikeModel.findOneAndDelete({ userId, postId });
    await PostModel.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });
  }

  // ── Comments ──────────────────────────────────────────────────────────────

  static async getComments(postId: string) {
    const comments = await CommentModel.find({ postId }).sort({ createdAt: -1 }).limit(50);
    const userIds = [...new Set(comments.map(c => c.userId))];
    const users = await UserModel.find({ _id: { $in: userIds } }).select("username");
    const profiles = await ProfileModel.find({ userId: { $in: userIds } }).select("userId avatarUrl displayName isVerified");
    const userMap: Record<string, any> = {};
    for (const u of users) userMap[u._id.toString()] = u;
    const profileMap: Record<string, any> = {};
    for (const p of profiles) profileMap[p.userId] = p;
    return comments.map(c => ({
      ...c.toObject(),
      author: {
        ...userMap[c.userId] ?? {},
        ...profileMap[c.userId] ?? {},
      },
    }));
  }

  static async addComment(userId: string, postId: string, text: string) {
    const comment = await CommentModel.create({ userId, postId, text });
    await PostModel.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });
    const post = await PostModel.findById(postId);
    if (post && post.authorId !== userId) {
      const user = await UserModel.findById(userId).select("username");
      await NotificationModel.create({
        userId: post.authorId,
        fromUserId: userId,
        type: "comment",
        message: `${user?.username} commented on your post`,
        targetId: postId,
      });
    }
    return comment;
  }

  static async deleteComment(userId: string, commentId: string) {
    const comment = await CommentModel.findById(commentId);
    if (!comment) throw new Error("Comment not found");
    if (comment.userId !== userId) throw new Error("Unauthorized");
    await CommentModel.findByIdAndDelete(commentId);
    await PostModel.findByIdAndUpdate(comment.postId, { $inc: { commentsCount: -1 } });
  }

  // ── Follow ────────────────────────────────────────────────────────────────

  static async followUser(userId: string, targetUserId: string) {
    if (userId === targetUserId) throw new Error("Cannot follow yourself");
    const existing = await FollowModel.findOne({ followerId: userId, followingId: targetUserId });
    if (existing) return;
    await FollowModel.create({ followerId: userId, followingId: targetUserId });
    await ProfileModel.findOneAndUpdate({ userId }, { $inc: { followingCount: 1 } }, { upsert: true });
    await ProfileModel.findOneAndUpdate({ userId: targetUserId }, { $inc: { followersCount: 1 } }, { upsert: true });
    const user = await UserModel.findById(userId).select("username");
    await NotificationModel.create({
      userId: targetUserId,
      fromUserId: userId,
      type: "follow",
      message: `${user?.username} started following you`,
      targetId: userId,
    });
  }

  static async unfollowUser(userId: string, targetUserId: string) {
    const result = await FollowModel.findOneAndDelete({ followerId: userId, followingId: targetUserId });
    if (result) {
      await ProfileModel.findOneAndUpdate({ userId }, { $inc: { followingCount: -1 } });
      await ProfileModel.findOneAndUpdate({ userId: targetUserId }, { $inc: { followersCount: -1 } });
    }
  }

  static async getFollowers(userId: string) {
    const follows = await FollowModel.find({ followingId: userId }).select("followerId");
    const ids = follows.map(f => f.followerId);
    const users = await UserModel.find({ _id: { $in: ids } }).select("username _id");
    const profiles = await ProfileModel.find({ userId: { $in: ids } }).select("userId avatarUrl displayName isVerified");
    const profileMap: Record<string, any> = {};
    for (const p of profiles) profileMap[p.userId] = p;
    return users.map(u => ({ ...u.toObject(), ...profileMap[u._id.toString()] }));
  }

  static async getFollowing(userId: string) {
    const follows = await FollowModel.find({ followerId: userId }).select("followingId");
    const ids = follows.map(f => f.followingId);
    const users = await UserModel.find({ _id: { $in: ids } }).select("username _id");
    const profiles = await ProfileModel.find({ userId: { $in: ids } }).select("userId avatarUrl displayName isVerified");
    const profileMap: Record<string, any> = {};
    for (const p of profiles) profileMap[p.userId] = p;
    return users.map(u => ({ ...u.toObject(), ...profileMap[u._id.toString()] }));
  }

  // ── Saved Posts ───────────────────────────────────────────────────────────

  static async savePost(userId: string, postId: string) {
    await ProfileModel.findOneAndUpdate({ userId }, { $addToSet: { savedPosts: postId } }, { upsert: true });
  }

  static async unsavePost(userId: string, postId: string) {
    await ProfileModel.findOneAndUpdate({ userId }, { $pull: { savedPosts: postId } });
  }

  static async getSavedPosts(userId: string) {
    const profile = await SocialService.getOrCreateProfile(userId);
    if (!profile.savedPosts?.length) return [];
    const ids = profile.savedPosts.map((id: string) => new mongoose.Types.ObjectId(id));
    const posts = await PostModel.find({ _id: { $in: ids }, isDeleted: false });
    return await SocialService.enrichPosts(posts.map(p => p.toObject()), userId);
  }

  // ── Notifications ─────────────────────────────────────────────────────────

  static async getNotifications(userId: string) {
    const notifications = await NotificationModel.find({ userId }).sort({ createdAt: -1 }).limit(50);
    const fromUserIds = notifications.filter(n => n.fromUserId).map(n => n.fromUserId!);
    const fromUsers = await UserModel.find({ _id: { $in: fromUserIds } }).select("username");
    const fromProfiles = await ProfileModel.find({ userId: { $in: fromUserIds } }).select("userId avatarUrl displayName isVerified");
    const userMap: Record<string, any> = {};
    for (const u of fromUsers) userMap[u._id.toString()] = u;
    const profileMap: Record<string, any> = {};
    for (const p of fromProfiles) profileMap[p.userId] = p;
    return notifications.map(n => ({
      ...n.toObject(),
      fromUser: n.fromUserId ? { ...userMap[n.fromUserId] ?? {}, ...profileMap[n.fromUserId] ?? {} } : null,
    }));
  }

  static async markNotificationsRead(userId: string) {
    await NotificationModel.updateMany({ userId, isRead: false }, { isRead: true });
  }

  // ── Messages ──────────────────────────────────────────────────────────────

  static async getConversations(userId: string) {
    const messages = await MessageModel.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ createdAt: -1 }).limit(100);

    // Deduplicate by conversation partner
    const seen = new Set<string>();
    const conversations: any[] = [];
    for (const msg of messages) {
      const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!seen.has(otherId)) {
        seen.add(otherId);
        conversations.push(msg);
      }
    }
    return conversations.slice(0, 30);
  }

  static async getMessages(userId: string, otherUserId: string) {
    const messages = await MessageModel.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 }).limit(100);
    await MessageModel.updateMany(
      { senderId: otherUserId, receiverId: userId, isRead: false },
      { isRead: true }
    );
    return messages;
  }

  static async sendMessage(userId: string, receiverId: string, text: string, mediaUrl?: string) {
    const message = await MessageModel.create({
      senderId: userId,
      receiverId,
      text: text ?? "",
      mediaUrl: mediaUrl ?? "",
    });
    const user = await UserModel.findById(userId).select("username");
    await NotificationModel.create({
      userId: receiverId,
      fromUserId: userId,
      type: "dm",
      message: `${user?.username} sent you a message`,
      targetId: userId,
    });
    return message;
  }

  // ── Block & Report ────────────────────────────────────────────────────────

  static async blockUser(userId: string, targetUserId: string) {
    await ProfileModel.findOneAndUpdate({ userId }, { $addToSet: { blockedUsers: targetUserId } }, { upsert: true });
    await SocialService.unfollowUser(userId, targetUserId).catch(() => {});
    await SocialService.unfollowUser(targetUserId, userId).catch(() => {});
  }

  static async unblockUser(userId: string, targetUserId: string) {
    await ProfileModel.findOneAndUpdate({ userId }, { $pull: { blockedUsers: targetUserId } });
  }

  static async submitReport(userId: string, data: { reportedUserId?: string; reportedPostId?: string; type: string; description?: string }) {
    await ReportModel.create({
      reporterId: userId,
      reportedUserId: data.reportedUserId,
      reportedPostId: data.reportedPostId,
      type: data.type,
      description: data.description ?? "",
    });
  }

  // ── Verification ──────────────────────────────────────────────────────────

  static async requestVerification(userId: string, data: { governmentIdUrl?: string }) {
    await ProfileModel.findOneAndUpdate(
      { userId },
      { $set: { verificationStatus: "pending", governmentIdUrl: data.governmentIdUrl ?? "" } },
      { upsert: true }
    );
  }

  // ── User Posts ────────────────────────────────────────────────────────────

  static async getUserPosts(userId: string, cursor?: string, limit = 12) {
    const query: any = { authorId: userId, type: { $in: ["photo", "video"] }, isDeleted: false };
    if (cursor) query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    const posts = await PostModel.find(query).sort({ _id: -1 }).limit(limit + 1);
    const hasMore = posts.length > limit;
    const data = hasMore ? posts.slice(0, limit) : posts;
    const nextCursor = hasMore ? data[data.length - 1]._id.toString() : null;
    return { data: data.map(p => p.toObject()), nextCursor, hasMore };
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  static async enrichPosts(posts: any[], viewerId?: string) {
    if (!posts.length) return posts;
    const authorIds = [...new Set(posts.map(p => p.authorId?.toString()).filter(Boolean))];
    const users = await UserModel.find({ _id: { $in: authorIds } }).select("username _id");
    const profiles = await ProfileModel.find({ userId: { $in: authorIds } })
      .select("userId avatarUrl displayName isVerified followersCount");

    const userMap: Record<string, any> = {};
    for (const u of users) userMap[u._id.toString()] = u.toObject();
    const profileMap: Record<string, any> = {};
    for (const p of profiles) profileMap[p.userId] = p.toObject();

    let likedPostIds = new Set<string>();
    let savedPostIds = new Set<string>();
    if (viewerId) {
      const postIds = posts.map(p => p._id.toString());
      const likes = await LikeModel.find({ userId: viewerId, postId: { $in: postIds } }).select("postId");
      for (const l of likes) likedPostIds.add(l.postId);
      const profile = await ProfileModel.findOne({ userId: viewerId }).select("savedPosts");
      if (profile?.savedPosts) savedPostIds = new Set(profile.savedPosts);
    }

    return posts.map(p => ({
      ...p,
      author: {
        _id: p.authorId,
        ...userMap[p.authorId?.toString()] ?? {},
        ...profileMap[p.authorId?.toString()] ?? {},
      },
      isLiked: likedPostIds.has(p._id.toString()),
      isSaved: savedPostIds.has(p._id.toString()),
    }));
  }
}
