"use client";

import { Button } from "@/components/ui/button";

const SUGGESTED_PROMPTS = [
  "How do I improve my front foot movement?",
  "What drill should I do tomorrow?",
  "How can I fix my head position while batting?",
  "Give me a 15-minute practice plan.",
];

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export function SuggestedPrompts({
  onSelect,
  disabled = false,
}: SuggestedPromptsProps) {
  return (
    <div className="overflow-x-auto px-3 pb-2 sm:px-4">
      <div className="flex flex-nowrap gap-2 sm:flex-wrap">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <Button
            key={prompt}
            type="button"
            variant="outline"
            size="sm"
            className="h-auto shrink-0 whitespace-nowrap text-left text-xs sm:whitespace-normal"
            disabled={disabled}
            onClick={() => onSelect(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  );
}
