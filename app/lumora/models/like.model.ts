import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { CommonTypegooseEntity } from "~/api/models/base/common-typegoose.entity";

@modelOptions({
  schemaOptions: {
    collection: "tbl_likes",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
})
export class Like extends CommonTypegooseEntity {
  @prop({ type: String, required: true })
  userId!: string;

  @prop({ type: String, required: true })
  postId!: string;
}

export const LikeModel = getModelForClass(Like);
