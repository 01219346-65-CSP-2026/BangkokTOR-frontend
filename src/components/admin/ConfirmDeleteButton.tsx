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
          className="rounded-lg bg-red-600 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-red-700"
        >
          {confirmLabel}
        </button>
        <button
          type="button"
          onClick={() => setIsConfirming(false)}
          className="rounded-lg px-2.5 py-1 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-800"
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
      className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
    >
      <TrashIcon />
    </button>
  );
}