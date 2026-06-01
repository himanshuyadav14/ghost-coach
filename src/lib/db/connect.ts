import mongoose from "mongoose";

import { env } from "@/config/env";

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const cached = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(env.MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export async function pingDB(): Promise<boolean> {
  try {
    const conn = await connectDB();
    if (conn.connection.db) {
      await conn.connection.db.admin().ping();
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function disconnectDB(): Promise<void> {
  cached.conn = null;
  cached.promise = null;
  return mongoose.disconnect();
}
