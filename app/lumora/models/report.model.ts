import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { CommonTypegooseEntity } from "~/api/models/base/common-typegoose.entity";

export type ReportType = "spam" | "fake_account" | "impersonation" | "harassment" | "inappropriate_content" | "other";
export type ReportStatus = "pending" | "reviewed" | "resolved" | "dismissed";

@modelOptions({
  schemaOptions: {
    collection: "tbl_reports",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
})
export class Report extends CommonTypegooseEntity {
  @prop({ type: String, required: true })
  reporterId!: string;

  @prop({ type: String })
  reportedUserId?: string;

  @prop({ type: String })
  reportedPostId?: string;

  @prop({ type: String, required: true, enum: ["spam", "fake_account", "impersonation", "harassment", "inappropriate_content", "other"] })
  type!: ReportType;

  @prop({ type: String, default: "" })
  description!: string;

  @prop({ type: String, enum: ["pending", "reviewed", "resolved", "dismissed"], default: "pending" })
  status!: ReportStatus;
}

export const ReportModel = getModelForClass(Report);
