import { Router } from "express";
import { requireAuth, optionalAuth } from "~/modules/authentication/authentication.middleware";
import { SocialController } from "../controllers/social.controller";

const router = Router();

// Profile
router.get("/social/profile/:userId", optionalAuth, SocialController.getProfile);
router.put("/social/profile", requireAuth, SocialController.updateProfile);
router.post("/social/profile/avatar", requireAuth, SocialController.uploadAvatar);

// Posts
router.get("/social/feed", requireAuth, SocialController.getFeed);
router.get("/social/posts/:postId", optionalAuth, SocialController.getPost);
router.post("/social/posts", requireAuth, SocialController.createPost);
router.delete("/social/posts/:postId", requireAuth, SocialController.deletePost);

// Reels & Stories
router.get("/social/reels", requireAuth, SocialController.getReels);
router.get("/social/stories", requireAuth, SocialController.getStories);

// Explore & Search
router.get("/social/explore", requireAuth, SocialController.explore);
router.get("/social/search", requireAuth, SocialController.search);
router.get("/social/trending", optionalAuth, SocialController.getTrending);

// Likes
router.post("/social/posts/:postId/like", requireAuth, SocialController.likePost);
router.delete("/social/posts/:postId/like", requireAuth, SocialController.unlikePost);

// Comments
router.get("/social/posts/:postId/comments", optionalAuth, SocialController.getComments);
router.post("/social/posts/:postId/comments", requireAuth, SocialController.addComment);
router.delete("/social/comments/:commentId", requireAuth, SocialController.deleteComment);

// Follow
router.post("/social/follow/:targetUserId", requireAuth, SocialController.followUser);
router.delete("/social/follow/:targetUserId", requireAuth, SocialController.unfollowUser);
router.get("/social/followers/:userId", optionalAuth, SocialController.getFollowers);
router.get("/social/following/:userId", optionalAuth, SocialController.getFollowing);

// Saved posts
router.post("/social/posts/:postId/save", requireAuth, SocialController.savePost);
router.delete("/social/posts/:postId/save", requireAuth, SocialController.unsavePost);
router.get("/social/saved", requireAuth, SocialController.getSavedPosts);

// Notifications
router.get("/social/notifications", requireAuth, SocialController.getNotifications);
router.put("/social/notifications/read", requireAuth, SocialController.markNotificationsRead);

// Messages
router.get("/social/messages", requireAuth, SocialController.getConversations);
router.get("/social/messages/:userId", requireAuth, SocialController.getMessages);
router.post("/social/messages/:userId", requireAuth, SocialController.sendMessage);

// Block & Report
router.post("/social/block/:targetUserId", requireAuth, SocialController.blockUser);
router.delete("/social/block/:targetUserId", requireAuth, SocialController.unblockUser);
router.post("/social/report", requireAuth, SocialController.submitReport);

// Verification
router.post("/social/verify/request", requireAuth, SocialController.requestVerification);

// User posts
router.get("/social/users/:userId/posts", optionalAuth, SocialController.getUserPosts);

export default router;
