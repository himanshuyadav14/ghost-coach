import mongoose from "mongoose";

import { connectDB } from "@/lib/db";
import { signToken } from "@/lib/auth/jwt";
import { comparePassword, hashPassword } from "@/lib/auth/password";
import { User, type IUser } from "@/models/user.model";
import { PlayerProfile } from "@/models/player-profile.model";
import type { LoginInput, RegisterInput } from "@/lib/validations/auth.schema";
import type { SessionUser } from "@/types/auth";
import type { ExperienceLevel } from "@/types/cricket";

export class AuthError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export function toSessionUser(
  user: IUser & { _id: mongoose.Types.ObjectId },
  skillLevel?: ExperienceLevel,
): SessionUser {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
    ...(skillLevel ? { skillLevel } : {}),
  };
}

export async function registerUser(input: RegisterInput) {
  await connectDB();

  const normalizedEmail = input.email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new AuthError("Email already registered", 409, "EMAIL_EXISTS");
  }

  const passwordHash = await hashPassword(input.password);
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const [user] = await User.create(
      [
        {
          name: input.name.trim(),
          email: normalizedEmail,
          passwordHash,
          role: "user" as const,
        },
      ],
      { session },
    );

    await PlayerProfile.create(
      [
        {
          userId: user._id,
          sport: "cricket",
          role: "batsman",
          skillLevel: input.experienceLevel,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    const token = signToken({
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return {
      user: toSessionUser(user, input.experienceLevel),
      token,
    };
  } catch (err) {
    await session.abortTransaction();

    if (
      err instanceof mongoose.mongo.MongoServerError &&
      err.code === 11000
    ) {
      throw new AuthError("Email already registered", 409, "EMAIL_EXISTS");
    }

    throw err;
  } finally {
    session.endSession();
  }
}

export async function loginUser(input: LoginInput) {
  await connectDB();

  const normalizedEmail = input.email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new AuthError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  const isValidPassword = await comparePassword(
    input.password,
    user.passwordHash,
  );

  if (!isValidPassword) {
    throw new AuthError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  const profile = await PlayerProfile.findOne({ userId: user._id });
  const skillLevel = profile?.skillLevel as ExperienceLevel | undefined;

  const token = signToken({
    sub: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  });

  return {
    user: toSessionUser(user, skillLevel),
    token,
  };
}

export async function getUserProfile(userId: string) {
  await connectDB();
  const profile = await PlayerProfile.findOne({ userId });
  return profile?.skillLevel as ExperienceLevel | undefined;
}
