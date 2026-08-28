"use client";

import { useState } from "react";
import { TrashIcon } from "@/components/icons/TrashIcon";

type ConfirmDeleteButtonProps = {
  onConfirm: () => void;
  ariaLabel: string;
  confirmLabel: string;
  cancelLabel: string;
};

export function ConfirmDeleteButton({
  onConfirm,
  ariaLabel,
  confirmLabel,
  cancelLabel,
}: ConfirmDeleteButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  if (isConfirming) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setIsConfirming(false);
            onConfirm();
          }}
          className="rounded-field bg-clay-500 px-2.5 py-1 text-xs font-semibold text-white transition duration-200 ease-soft hover:brightness-95 focus-visible:ring-2 focus-visible:ring-clay-500 focus-visible:outline-none"
        >
          {confirmLabel}
        </button>
        <button
          type="button"
          onClick={() => setIsConfirming(false)}
          className="rounded-field px-2.5 py-1 text-xs font-medium text-ink-500 transition duration-200 ease-soft hover:text-moss-700 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
        >
          {cancelLabel}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsConfirming(true)}
      aria-label={ariaLabel}
      className="flex h-8 w-8 items-center justify-center rounded-field text-sage-400 transition duration-200 ease-soft hover:bg-clay-500/10 hover:text-clay-500 focus-visible:ring-2 focus-visible:ring-clay-500 focus-visible:outline-none"
    >
      <TrashIcon />
    </button>
  );
}