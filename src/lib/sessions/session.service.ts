import mongoose from "mongoose";

import { connectDB } from "@/lib/db";
import { SessionError } from "@/lib/sessions/session-error";
import {
  CoachingSession,
  type ICoachingSession,
} from "@/models/coaching-session.model";
import type {
  CoachingReport,
  SessionDetail,
  SessionSummary,
} from "@/types/coaching";
import type { AllowedImageType } from "@/lib/validations/analysis.schema";

function getImageUrl(sessionId: string): string {
  return `/api/sessions/${sessionId}/image`;
}

export function toSessionSummary(
  doc: Pick<ICoachingSession, "report" | "createdAt"> & {
    _id: mongoose.Types.ObjectId;
  },
): SessionSummary {
  const id = doc._id.toString();
  return {
    id,
    overallScore: doc.report.overallScore,
    priorityFix: doc.report.priorityFix,
    confidenceLevel: doc.report.confidenceLevel,
    createdAt: doc.createdAt.toISOString(),
    imageUrl: getImageUrl(id),
  };
}

export function toSessionDetail(doc: ICoachingSession & { _id: mongoose.Types.ObjectId }): SessionDetail {
  return {
    ...toSessionSummary(doc),
    report: doc.report,
    imageMimeType: doc.imageMimeType,
  };
}

export async function createSession(
  userId: string,
  imageBuffer: Buffer,
  mimeType: AllowedImageType,
  report: CoachingReport,
): Promise<SessionSummary> {
  await connectDB();

  const session = await CoachingSession.create({
    userId,
    imageData: imageBuffer,
    imageMimeType: mimeType,
    report,
  });

  return toSessionSummary(session);
}

export async function listSessions(
  userId: string,
  { page, pageSize }: { page: number; pageSize: number },
) {
  await connectDB();

  const filter = { userId: new mongoose.Types.ObjectId(userId) };
  const skip = (page - 1) * pageSize;

  const [sessions, total] = await Promise.all([
    CoachingSession.find(filter)
      .select("-imageData")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),
    CoachingSession.countDocuments(filter),
  ]);

  return {
    items: sessions.map((s) =>
      toSessionSummary({
        _id: s._id,
        report: s.report,
        createdAt: s.createdAt,
      }),
    ),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize) || 1,
  };
}

async function findOwnedSession(
  userId: string,
  sessionId: string,
  select?: string,
) {
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new SessionError("Invalid session ID", 422, "INVALID_ID");
  }

  await connectDB();

  const query = CoachingSession.findOne({
    _id: sessionId,
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (select) {
    query.select(select);
  }

  const session = await query.lean();

  if (!session) {
    throw new SessionError("Session not found", 404, "NOT_FOUND");
  }

  return session;
}

export async function getSessionById(
  userId: string,
  sessionId: string,
): Promise<SessionDetail> {
  const session = await findOwnedSession(userId, sessionId, "-imageData");
  return toSessionDetail({
    _id: session._id,
    userId: session.userId,
    imageData: Buffer.alloc(0),
    imageMimeType: session.imageMimeType,
    report: session.report,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  });
}

export async function getSessionImage(userId: string, sessionId: string) {
  const session = await findOwnedSession(
    userId,
    sessionId,
    "imageData imageMimeType",
  );

  const imageData = session.imageData as Buffer | { buffer: ArrayBuffer };

  return {
    buffer: Buffer.isBuffer(imageData)
      ? imageData
      : Buffer.from(imageData.buffer),
    mimeType: session.imageMimeType as AllowedImageType,
  };
}
