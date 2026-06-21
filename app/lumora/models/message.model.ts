import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { CommonTypegooseEntity } from "~/api/models/base/common-typegoose.entity";

@modelOptions({
  schemaOptions: {
    collection: "tbl_messages",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
})
export class Message extends CommonTypegooseEntity {
  @prop({ type: String, required: true })
  senderId!: string;

  @prop({ type: String, required: true })
  receiverId!: string;

  @prop({ type: String, required: true })
  text!: string;

  @prop({ type: Boolean, default: false })
  isRead!: boolean;

  @prop({ type: String, default: "" })
  mediaUrl!: string;
}

export const MessageModel = getModelForClass(Message);
