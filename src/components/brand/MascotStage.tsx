"use client";

import { useEffect, useState } from "react";
import { Mascot } from "./Mascot";

/**
 * Bridges form state to the mascot without turning AuthShell into a client
 * component: it listens for focus on any password field in the document and
 * shields the mascot's eyes while one is active.
 */
export function MascotStage({ className }: { className?: string }) {
  const [shielded, setShielded] = useState(false);

  useEffect(() => {
    const isPassword = (target: EventTarget | null) =>
      target instanceof HTMLInputElement && target.type === "password";

    const onFocus = (event: FocusEvent) => {
      if (isPassword(event.target)) setShielded(true);
    };
    const onBlur = (event: FocusEvent) => {
      if (isPassword(event.target)) setShielded(false);
    };

    document.addEventListener("focusin", onFocus);
    document.addEventListener("focusout", onBlur);
    return () => {
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("focusout", onBlur);
    };
  }, []);

  return <Mascot className={className} shielded={shielded} />;
}
