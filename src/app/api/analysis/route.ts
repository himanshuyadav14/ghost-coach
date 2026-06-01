import { withAuth } from "@/lib/api/handler";
import { error, success } from "@/lib/api/response";
import { getUserProfile } from "@/lib/auth/auth.service";
import { analyzeBattingImage } from "@/lib/gemini/analyze-batting";
import { AnalysisError } from "@/lib/gemini/analysis-error";
import { createSession } from "@/lib/sessions/session.service";
import {
  validateServerImage,
  type AllowedImageType,
} from "@/lib/validations/analysis.schema";
import type { ExperienceLevel } from "@/types/cricket";

export const POST = withAuth(async (request, session) => {
  try {
    const formData = await request.formData();
    const imageField = formData.get("image");
    const validation = validateServerImage(
      imageField instanceof File ? imageField : null,
    );

    if (!validation.valid) {
      return error(validation.message, 400, "INVALID_IMAGE");
    }

    const { file } = validation;
    const experienceLevel =
      (await getUserProfile(session.id)) ?? ("beginner" as ExperienceLevel);

    const buffer = Buffer.from(await file.arrayBuffer());
    const imageBase64 = buffer.toString("base64");

    const report = await analyzeBattingImage({
      imageBase64,
      mimeType: file.type as AllowedImageType,
      playerName: session.name,
      experienceLevel,
    });

    const savedSession = await createSession(
      session.id,
      buffer,
      file.type as AllowedImageType,
      report,
    );

    return success({ report, sessionId: savedSession.id });
  } catch (err) {
    if (err instanceof AnalysisError) {
      return error(err.message, err.status, err.code);
    }
    throw err;
  }
});
