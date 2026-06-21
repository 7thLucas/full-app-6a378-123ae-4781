import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
import { CommonTypegooseEntity } from "~/api/models/base/common-typegoose.entity";

export type PostType = "photo" | "video" | "reel" | "story";

@modelOptions({
  schemaOptions: {
    collection: "tbl_posts",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
})
export class Post extends CommonTypegooseEntity {
  @prop({ type: String, required: true })
  authorId!: string;

  @prop({ type: String, required: true, enum: ["photo", "video", "reel", "story"] })
  type!: PostType;

  @prop({ type: String, required: true })
  mediaUrl!: string;

  @prop({ type: String })
  thumbnailUrl?: string;

  @prop({ type: String, default: "" })
  caption!: string;

  @prop({ type: [String], default: [] })
  hashtags!: string[];

  @prop({ type: Number, default: 0 })
  likesCount!: number;

  @prop({ type: Number, default: 0 })
  commentsCount!: number;

  @prop({ type: Number, default: 0 })
  sharesCount!: number;

  @prop({ type: Boolean, default: false })
  isDeleted!: boolean;

  @prop({ type: Date, default: null })
  expiresAt?: Date | null;
}

export const PostModel = getModelForClass(Post);
