import {
  Schema,
  model,
  models,
  type Document,
  type Model,
  type Types,
} from "mongoose";

import type { CoachingReport } from "@/types/coaching";
import type { Timestamps } from "@/types/mongoose";
import type { AllowedImageType } from "@/lib/validations/analysis.schema";

export interface ICoachingSession extends Timestamps {
  userId: Types.ObjectId;
  imageData: Buffer;
  imageMimeType: AllowedImageType;
  report: CoachingReport;
}

export type CoachingSessionDocument = ICoachingSession & Document;

const coachingReportSchema = new Schema<CoachingReport>(
  {
    overallScore: { type: Number, required: true, min: 0, max: 100 },
    strengths: { type: [String], required: true },
    areasToImprove: { type: [String], required: true },
    priorityFix: { type: String, required: true },
    drillSuggestion: { type: String, required: true },
    confidenceLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
  },
  { _id: false },
);

const coachingSessionSchema = new Schema<ICoachingSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    imageData: {
      type: Buffer,
      required: true,
    },
    imageMimeType: {
      type: String,
      enum: ["image/png", "image/jpeg"],
      required: true,
    },
    report: {
      type: coachingReportSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

coachingSessionSchema.index({ userId: 1, createdAt: -1 });

export const CoachingSession: Model<ICoachingSession> =
  models.CoachingSession ??
  model<ICoachingSession>("CoachingSession", coachingSessionSchema);
