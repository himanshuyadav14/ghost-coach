import type { ExperienceLevel } from "@/types/cricket";
import { parseCoachingReport } from "@/lib/validations/analysis.schema";
import { getGeminiModel } from "@/lib/gemini/client";
import { AnalysisError } from "@/lib/gemini/analysis-error";

interface BuildPromptParams {
  playerName: string;
  experienceLevel: ExperienceLevel;
}

interface AnalyzeBattingParams {
  imageBase64: string;
  mimeType: "image/png" | "image/jpeg";
  playerName: string;
  experienceLevel: ExperienceLevel;
}

const experienceLevelGuidance: Record<ExperienceLevel, string> = {
  beginner:
    "Use simple language, focus on fundamentals (stance, grip, balance), and suggest basic drills.",
  intermediate:
    "Provide moderate technical detail on timing, footwork, and shot selection with structured drills.",
  advanced:
    "Give advanced technical feedback on biomechanics, power generation, and match-situation adjustments.",
};

export function buildCoachingPrompt({
  playerName,
  experienceLevel,
}: BuildPromptParams): string {
  return `You are an expert cricket batting coach analyzing a batsman's technique from an uploaded image.

Player: ${playerName}
Sport: Cricket
Role: Batsman
Experience Level: ${experienceLevel}
Coaching approach: ${experienceLevelGuidance[experienceLevel]}

Analyze whatever is visible in the image: stance, grip, balance, head position, backlift, foot placement, and alignment. If the image is unclear, not cricket-related, or too obscured to assess, still return valid JSON with a lower overallScore and confidenceLevel "Low".

Return ONLY valid JSON with exactly these keys and no markdown:
{
  "overallScore": number (0-100),
  "strengths": string[] (at least 1 item),
  "areasToImprove": string[] (at least 1 item),
  "priorityFix": string,
  "drillSuggestion": string,
  "confidenceLevel": "Low" | "Medium" | "High"
}

Rules:
- Personalize feedback for a ${experienceLevel} batsman
- Be practical and actionable
- Do not include any text outside the JSON object`;
}

export async function analyzeBattingImage({
  imageBase64,
  mimeType,
  playerName,
  experienceLevel,
}: AnalyzeBattingParams) {
  const prompt = buildCoachingPrompt({ playerName, experienceLevel });
  const model = getGeminiModel();

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType,
        },
      },
    ]);

    const text = result.response.text();
    if (!text) {
      throw new AnalysisError(
        "No analysis returned from the AI model",
        502,
        "ANALYSIS_FAILED",
      );
    }

    const parsed = parseCoachingReport(text);
    if (!parsed.success) {
      console.error("[Gemini Parse Error]", parsed.error, parsed.details);
      throw new AnalysisError(
        "Failed to generate a valid coaching report. Please try again.",
        502,
        "ANALYSIS_FAILED",
      );
    }

    return parsed.data;
  } catch (err) {
    if (err instanceof AnalysisError) {
      throw err;
    }

    console.error("[Gemini API Error]", err);
    throw new AnalysisError(
      "Analysis service is temporarily unavailable. Please try again.",
      502,
      "ANALYSIS_FAILED",
    );
  }
}
