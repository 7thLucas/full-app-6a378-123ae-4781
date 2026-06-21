import type { Request, Response } from "express";
import { SocialService } from "../services/social.service";

type P = Record<string, string>;

export class SocialController {
  static async getProfile(req: Request, res: Response) {
    try {
      const params = req.params as P;
      const profile = await SocialService.getProfile(params.userId, (req as any).user?.id);
      res.json({ success: true, data: profile });
    } catch (e: any) {
      res.status(404).json({ success: false, error: e.message });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const profile = await SocialService.updateProfile(userId, req.body);
      res.json({ success: true, data: profile });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async uploadAvatar(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { avatarUrl } = req.body;
      const profile = await SocialService.updateProfile(userId, { avatarUrl });
      res.json({ success: true, data: profile });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async getFeed(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { cursor, limit = "12" } = req.query as P;
      const result = await SocialService.getFeed(userId, cursor, parseInt(limit));
      res.json({ success: true, ...result });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async getPost(req: Request, res: Response) {
    try {
      const params = req.params as P;
      const post = await SocialService.getPost(params.postId, (req as any).user?.id);
      res.json({ success: true, data: post });
    } catch (e: any) {
      res.status(404).json({ success: false, error: e.message });
    }
  }

  static async createPost(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const post = await SocialService.createPost(userId, req.body);
      res.json({ success: true, data: post });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async deletePost(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const params = req.params as P;
      await SocialService.deletePost(userId, params.postId);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async getReels(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { cursor, limit = "10" } = req.query as P;
      const result = await SocialService.getReels(userId, cursor, parseInt(limit));
      res.json({ success: true, ...result });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async getStories(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const stories = await SocialService.getStories(userId);
      res.json({ success: true, data: stories });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async explore(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { cursor, limit = "24" } = req.query as P;
      const result = await SocialService.explore(userId, cursor, parseInt(limit));
      res.json({ success: true, ...result });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async search(req: Request, res: Response) {
    try {
      const { q, type = "all" } = req.query as P;
      const results = await SocialService.search(q, type);
      res.json({ success: true, data: results });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async getTrending(req: Request, res: Response) {
    try {
      const trending = await SocialService.getTrending();
      res.json({ success: true, data: trending });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async likePost(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const params = req.params as P;
      await SocialService.likePost(userId, params.postId);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async unlikePost(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const params = req.params as P;
      await SocialService.unlikePost(userId, params.postId);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async getComments(req: Request, res: Response) {
    try {
      const params = req.params as P;
      const comments = await SocialService.getComments(params.postId);
      res.json({ success: true, data: comments });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async addComment(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const params = req.params as P;
      const comment = await SocialService.addComment(userId, params.postId, req.body.text);
      res.json({ success: true, data: comment });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async deleteComment(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const params = req.params as P;
      await SocialService.deleteComment(userId, params.commentId);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async followUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const params = req.params as P;
      await SocialService.followUser(userId, params.targetUserId);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async unfollowUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const params = req.params as P;
      await SocialService.unfollowUser(userId, params.targetUserId);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async getFollowers(req: Request, res: Response) {
    try {
      const params = req.params as P;
      const data = await SocialService.getFollowers(params.userId);
      res.json({ success: true, data });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async getFollowing(req: Request, res: Response) {
    try {
      const params = req.params as P;
      const data = await SocialService.getFollowing(params.userId);
      res.json({ success: true, data });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async savePost(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const params = req.params as P;
      await SocialService.savePost(userId, params.postId);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async unsavePost(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const params = req.params as P;
      await SocialService.unsavePost(userId, params.postId);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async getSavedPosts(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const posts = await SocialService.getSavedPosts(userId);
      res.json({ success: true, data: posts });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async getNotifications(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const notifications = await SocialService.getNotifications(userId);
      res.json({ success: true, data: notifications });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async markNotificationsRead(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      await SocialService.markNotificationsRead(userId);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async getConversations(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const conversations = await SocialService.getConversations(userId);
      res.json({ success: true, data: conversations });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async getMessages(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const params = req.params as P;
      const messages = await SocialService.getMessages(userId, params.userId);
      res.json({ success: true, data: messages });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async sendMessage(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const params = req.params as P;
      const message = await SocialService.sendMessage(userId, params.userId, req.body.text, req.body.mediaUrl);
      res.json({ success: true, data: message });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async blockUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const params = req.params as P;
      await SocialService.blockUser(userId, params.targetUserId);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async unblockUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const params = req.params as P;
      await SocialService.unblockUser(userId, params.targetUserId);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async submitReport(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      await SocialService.submitReport(userId, req.body);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async requestVerification(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      await SocialService.requestVerification(userId, req.body);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async getUserPosts(req: Request, res: Response) {
    try {
      const params = req.params as P;
      const { cursor, limit = "12" } = req.query as P;
      const result = await SocialService.getUserPosts(params.userId, cursor, parseInt(limit));
      res.json({ success: true, ...result });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }
}
