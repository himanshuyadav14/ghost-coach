"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Upload, X } from "lucide-react";

import {
  MAX_IMAGE_SIZE_MB,
  validateImageFile,
} from "@/lib/validations/analysis.schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ImageUploadProps {
  onAnalyze: (file: File) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ImageUpload({
  onAnalyze,
  isLoading = false,
  disabled = false,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const resetFile = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [previewUrl]);

  const handleFile = useCallback(
    (selected: File | null) => {
      if (!selected) return;

      const validationError = validateImageFile(selected);
      if (validationError) {
        setError(validationError);
        return;
      }

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setError(null);
    },
    [previewUrl],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled || isLoading) return;
      const dropped = e.dataTransfer.files[0];
      handleFile(dropped ?? null);
    },
    [disabled, isLoading, handleFile],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Batting Image</CardTitle>
        <CardDescription>
          Upload a PNG or JPEG (max {MAX_IMAGE_SIZE_MB}MB) showing your batting
          stance or technique
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!previewUrl ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              if (!disabled && !isLoading) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => !disabled && !isLoading && inputRef.current?.click()}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30",
              (disabled || isLoading) && "pointer-events-none opacity-50",
            )}
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <ImagePlus className="h-7 w-7 text-primary" />
            </div>
            <p className="font-medium">Drag and drop your image here</p>
            <p className="mt-1 text-sm text-muted-foreground">
              or click to browse — PNG, JPEG up to {MAX_IMAGE_SIZE_MB}MB
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl border bg-muted/20">
              <div className="relative aspect-video w-full">
                <Image
                  src={previewUrl}
                  alt="Batting technique preview"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              {!isLoading && (
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-xs"
                  className="absolute top-2 right-2"
                  onClick={resetFile}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove image</span>
                </Button>
              )}
            </div>
            {file && (
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="rounded-md bg-muted px-2 py-1 font-medium text-foreground">
                  {file.name}
                </span>
                <span>{formatFileSize(file.size)}</span>
              </div>
            )}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          disabled={disabled || isLoading}
        />

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            className="flex-1"
            disabled={!file || isLoading || disabled}
            onClick={() => file && onAnalyze(file)}
          >
            <Upload className="h-4 w-4" />
            {isLoading ? "Analyzing..." : "Analyze Technique"}
          </Button>
          {previewUrl && !isLoading && (
            <Button
              type="button"
              variant="outline"
              onClick={resetFile}
              disabled={disabled}
            >
              Choose different image
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function resetImageUploadState() {
  return { file: null, previewUrl: null, error: null };
}
