"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { useTranslations } from "@/i18n/LanguageProvider";

/**
 * Google-only, like login. Name and email come from the Google account, so
 * there is nothing left to type here — the screen is one button.
 *
 * No step indicator: signing up is now a single action, and the four numbered
 * steps belong to /skills. Numbering a one-step screen would be decoration
 * pretending to be structure.
 */
export default function SignUpPage() {
  const t = useTranslations("signup");
  const [isPending, setIsPending] = useState(false);

  function handleGoogleSignUp() {
    // A newly created account has no profile, so send it straight to /skills
    // to build one. (Once the backend exists, this should instead branch on
    // whether the account already has a saved profile — see auth.ts.)
    setIsPending(true);
    signIn("google", { callbackUrl: "/skills" }).catch(() => setIsPending(false));
  }

  return (
    <AuthShell maxWidthClassName="max-w-[24rem]">
      <h1 className="font-display text-3xl tracking-tight text-moss-700">
        {t.heading}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">
        {t.subheading}
      </p>

      <div className="mt-8">
        <Button
          type="button"
          variant="secondary"
          fullWidth
          isLoading={isPending}
          onClick={handleGoogleSignUp}
        >
          {!isPending && <GoogleIcon />}
          {t.googleContinue}
        </Button>

        <p className="mt-3.5 text-xs leading-relaxed text-ink-500">
          {t.googleOnlyNote}
        </p>
      </div>

      <p className="mt-8 border-t border-sage-100 pt-6 text-sm text-ink-600">
        {t.alreadyHaveAccount}{" "}
        <Link
          href="/login"
          className="rounded font-medium text-sage-600 underline-offset-4 outline-none hover:text-moss-700 hover:underline focus-visible:ring-2 focus-visible:ring-sage-600/40"
        >
          {t.logIn}
        </Link>
      </p>
    </AuthShell>
  );
}
