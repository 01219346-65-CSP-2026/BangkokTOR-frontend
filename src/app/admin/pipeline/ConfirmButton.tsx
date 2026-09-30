"use client";

import { useState } from "react";
import { useTranslations } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/Button";

/**
 * A button that asks once before acting. The first click swaps it for the
 * question and Yes/Cancel in place — no modal, so the reader never loses sight
 * of which rows the action is about.
 */
export function ConfirmButton({
  label,
  question,
  onConfirm,
  disabled = false,
  isLoading = false,
}: {
  label: string;
  question: string;
  onConfirm: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}) {
  const t = useTranslations("admin");
  const [asking, setAsking] = useState(false);

  if (!asking) {
    return (
      <Button
        type="button"
        variant="secondary"
        shape="rounded"
        size="sm"
        disabled={disabled}
        isLoading={isLoading}
        onClick={() => setAsking(true)}
      >
        {label}
      </Button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-xs text-ink-600">{question}</span>
      <Button
        type="button"
        shape="rounded"
        size="sm"
        onClick={() => {
          setAsking(false);
          onConfirm();
        }}
      >
        {t.pipeline.confirmYes}
      </Button>
      <Button
        type="button"
        variant="ghost"
        shape="rounded"
        size="sm"
        onClick={() => setAsking(false)}
      >
        {t.pipeline.confirmCancel}
      </Button>
    </span>
  );
}
