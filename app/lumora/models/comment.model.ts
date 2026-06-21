import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { CommonTypegooseEntity } from "~/api/models/base/common-typegoose.entity";

@modelOptions({
  schemaOptions: {
    collection: "tbl_comments",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
})
export class Comment extends CommonTypegooseEntity {
  @prop({ type: String, required: true })
  userId!: string;

  @prop({ type: String, required: true })
  postId!: string;

  @prop({ type: String, required: true })
  text!: string;

  @prop({ type: Number, default: 0 })
  likesCount!: number;
}

export const CommentModel = getModelForClass(Comment);
