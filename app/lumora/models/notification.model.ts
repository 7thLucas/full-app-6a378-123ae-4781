import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { CommonTypegooseEntity } from "~/api/models/base/common-typegoose.entity";

export type NotificationType = "like" | "comment" | "follow" | "dm" | "mention" | "system";

@modelOptions({
  schemaOptions: {
    collection: "tbl_notifications",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
})
export class Notification extends CommonTypegooseEntity {
  @prop({ type: String, required: true })
  userId!: string;

  @prop({ type: String })
  fromUserId?: string;

  @prop({ type: String, required: true, enum: ["like", "comment", "follow", "dm", "mention", "system"] })
  type!: NotificationType;

  @prop({ type: String, required: true })
  message!: string;

  @prop({ type: String, default: "" })
  targetId!: string;

  @prop({ type: Boolean, default: false })
  isRead!: boolean;
}

export const NotificationModel = getModelForClass(Notification);
