"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { apiClient } from "@/lib/api/client";
import type { CoachingReport } from "@/types/coaching";
import { AnalysisLoading } from "@/components/analysis/analysis-loading";
import { CoachingReportView } from "@/components/analysis/coaching-report";
import { ImageUpload } from "@/components/analysis/image-upload";
import { ErrorState } from "@/components/shared/error-state";

type PageState = "idle" | "loading" | "success" | "error";

export default function AnalysisPage() {
  const [pageState, setPageState] = useState<PageState>("idle");
  const [report, setReport] = useState<CoachingReport | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadKey, setUploadKey] = useState(0);

  const handleAnalyze = useCallback(async (file: File) => {
    setPageState("loading");
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("image", file);

    const response = await apiClient.uploadAnalysis(formData);

    if (!response.success) {
      setPageState("error");
      setErrorMessage(response.error.message);
      toast.error(response.error.message);
      return;
    }

    setReport(response.data.report);
    setSessionId(response.data.sessionId);
    setPageState("success");
    toast.success("Analysis complete!");
  }, []);

  const handleAnalyzeAnother = useCallback(() => {
    setReport(null);
    setSessionId(null);
    setErrorMessage(null);
    setPageState("idle");
    setUploadKey((k) => k + 1);
  }, []);

  const handleRetry = useCallback(() => {
    setErrorMessage(null);
    setPageState("idle");
    setUploadKey((k) => k + 1);
  }, []);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          Technique Analysis
        </h1>
        <p className="text-muted-foreground">
          Upload a batting image to receive personalized AI coaching feedback
        </p>
      </div>

      {pageState === "loading" && <AnalysisLoading />}

      {pageState === "success" && report && (
        <CoachingReportView
          report={report}
          sessionId={sessionId ?? undefined}
          onAnalyzeAnother={handleAnalyzeAnother}
        />
      )}

      {(pageState === "idle" || pageState === "error") && (
        <>
          {pageState === "error" && errorMessage && (
            <ErrorState
              title="Analysis failed"
              message={errorMessage}
              onRetry={handleRetry}
            />
          )}
          <ImageUpload
            key={uploadKey}
            onAnalyze={handleAnalyze}
            isLoading={false}
          />
        </>
      )}
    </div>
  );
}
