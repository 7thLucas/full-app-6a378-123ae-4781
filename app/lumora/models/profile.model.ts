import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { CommonTypegooseEntity } from "~/api/models/base/common-typegoose.entity";

export type VerificationStatus = "none" | "pending" | "verified" | "rejected";

@modelOptions({
  schemaOptions: {
    collection: "tbl_profiles",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
})
export class Profile extends CommonTypegooseEntity {
  @prop({ type: String, required: true, unique: true })
  userId!: string;

  @prop({ type: String, default: "" })
  displayName!: string;

  @prop({ type: String, default: "" })
  bio!: string;

  @prop({ type: String, default: "" })
  avatarUrl!: string;

  @prop({ type: String, default: "" })
  website!: string;

  @prop({ type: Number, default: 0 })
  followersCount!: number;

  @prop({ type: Number, default: 0 })
  followingCount!: number;

  @prop({ type: Number, default: 0 })
  postsCount!: number;

  @prop({ type: Boolean, default: false })
  isVerified!: boolean;

  @prop({ type: String, enum: ["none", "pending", "verified", "rejected"], default: "none" })
  verificationStatus!: VerificationStatus;

  @prop({ type: String, default: "" })
  governmentIdUrl!: string;

  @prop({ type: Boolean, default: true })
  isPublic!: boolean;

  @prop({ type: Boolean, default: false })
  twoFactorEnabled!: boolean;

  @prop({ type: [String], default: [] })
  savedPosts!: string[];

  @prop({ type: [String], default: [] })
  blockedUsers!: string[];
}

export const ProfileModel = getModelForClass(Profile);
