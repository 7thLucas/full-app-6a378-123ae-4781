import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { CommonTypegooseEntity } from "~/api/models/base/common-typegoose.entity";

@modelOptions({
  schemaOptions: {
    collection: "tbl_follows",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
})
export class Follow extends CommonTypegooseEntity {
  @prop({ type: String, required: true })
  followerId!: string;

  @prop({ type: String, required: true })
  followingId!: string;
}

export const FollowModel = getModelForClass(Follow);
