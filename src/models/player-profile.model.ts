import {
  Schema,
  model,
  models,
  type Document,
  type Model,
  type Types,
} from "mongoose";

import type {
  Handedness,
  PlayerRole,
  ShotCategory,
  SkillLevel,
  Sport,
} from "@/types/cricket";
import type { Timestamps } from "@/types/mongoose";

export interface IPlayerProfile extends Timestamps {
  userId: Types.ObjectId;
  sport: Sport;
  role: PlayerRole;
  handedness: Handedness;
  skillLevel: SkillLevel;
  preferredShots: ShotCategory[];
  goals: {
    title: string;
    description?: string;
    targetDate?: Date;
  }[];
}

export type PlayerProfileDocument = IPlayerProfile & Document;

const playerProfileSchema = new Schema<IPlayerProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    sport: {
      type: String,
      enum: ["cricket"],
      default: "cricket",
    },
    role: {
      type: String,
      enum: ["batsman"],
      default: "batsman",
    },
    handedness: {
      type: String,
      enum: ["right", "left"],
      default: "right",
    },
    skillLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "elite"],
      default: "beginner",
    },
    preferredShots: {
      type: [String],
      enum: ["defensive", "attacking", "sweep", "pull", "drive"],
      default: [],
    },
    goals: [
      {
        title: { type: String, required: true },
        description: { type: String },
        targetDate: { type: Date },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// TODO: Add instance/static methods in feature phase

export const PlayerProfile: Model<IPlayerProfile> =
  models.PlayerProfile ??
  model<IPlayerProfile>("PlayerProfile", playerProfileSchema);
