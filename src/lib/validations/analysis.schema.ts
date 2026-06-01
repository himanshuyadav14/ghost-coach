import { z } from "zod";

export const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg"] as const;
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGE_SIZE_MB = 5;

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

export const coachingReportSchema = z.object({
  overallScore: z.number().min(0).max(100),
  strengths: z.array(z.string().min(1)).min(1),
  areasToImprove: z.array(z.string().min(1)).min(1),
  priorityFix: z.string().min(1),
  drillSuggestion: z.string().min(1),
  confidenceLevel: z.enum(["Low", "Medium", "High"]),
});

export type CoachingReportInput = z.infer<typeof coachingReportSchema>;

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as AllowedImageType)) {
    return "Only PNG and JPEG images are allowed";
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `Image must be ${MAX_IMAGE_SIZE_MB}MB or smaller`;
  }

  return null;
}

export function stripJsonFences(raw: string): string {
  const trimmed = raw.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  return fenceMatch ? fenceMatch[1].trim() : trimmed;
}

export function parseCoachingReport(raw: string) {
  const cleaned = stripJsonFences(raw);

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return {
      success: false as const,
      error: "Failed to parse coaching report JSON",
    };
  }

  const result = coachingReportSchema.safeParse(parsed);
  if (!result.success) {
    return {
      success: false as const,
      error: "Coaching report did not match expected format",
      details: result.error.issues,
    };
  }

  return { success: true as const, data: result.data };
}

export function validateServerImage(
  file: File | null,
): { valid: true; file: File } | { valid: false; message: string } {
  if (!file || !(file instanceof File)) {
    return { valid: false, message: "No image file provided" };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type as AllowedImageType)) {
    return { valid: false, message: "Only PNG and JPEG images are allowed" };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      message: `Image must be ${MAX_IMAGE_SIZE_MB}MB or smaller`,
    };
  }

  return { valid: true, file };
}
