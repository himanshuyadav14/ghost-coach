import { Schema, model, models, type Document, type Model } from "mongoose";

import type { UserRole } from "@/types/auth";
import type { Timestamps } from "@/types/mongoose";

export interface IUser extends Timestamps {
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
}

export type UserDocument = IUser & Document;

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

// TODO: Add pre-save hook for password hashing in feature phase

export const User: Model<IUser> =
  models.User ?? model<IUser>("User", userSchema);
