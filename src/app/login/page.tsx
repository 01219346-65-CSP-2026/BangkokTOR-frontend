"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { useTranslations } from "@/i18n/LanguageProvider";

/**
 * Google is the only way in. There is no email/password form and no
 * `/forgot-password` — with no password to forget, both were dead weight.
 *
 * Returning users land on the app; a Google account with no saved profile is
 * routed to /skills instead. That decision belongs to the callback once the
 * backend exists, which is why it isn't guessed at here.
 */
export default function LoginPage() {
  const t = useTranslations("login");
  const [isPending, setIsPending] = useState(false);

  function handleGoogleLogin() {
    // the proxy sets callbackUrl when it bounces an unauthenticated visitor
    // off a protected route; honor it so they land back where they were.
    const callbackUrl =
      new URLSearchParams(window.location.search).get("callbackUrl") ?? "/skills";
    setIsPending(true);
    signIn("google", { callbackUrl }).catch(() => setIsPending(false));
  }

  return (
    <AuthShell maxWidthClassName="max-w-[24rem]">
      <h1 className="font-display text-3xl tracking-tight text-moss-700">
        {t.heading}
      </h1>
      <p className="mt-2 text-sm text-ink-600">{t.subheading}</p>

      <div className="mt-8">
        <Button
          type="button"
          variant="secondary"
          fullWidth
          isLoading={isPending}
          onClick={handleGoogleLogin}
        >
          {!isPending && <GoogleIcon />}
          {t.googleContinue}
        </Button>

        <p className="mt-3.5 text-xs leading-relaxed text-ink-500">
          {t.googleOnlyNote}
        </p>
      </div>

      <p className="mt-8 border-t border-sage-100 pt-6 text-sm text-ink-600">
        {t.noAccount}{" "}
        <Link
          href="/signup"
          className="rounded font-medium text-sage-600 underline-offset-4 outline-none hover:text-moss-700 hover:underline focus-visible:ring-2 focus-visible:ring-sage-600/40"
        >
          {t.createOne}
        </Link>
      </p>
    </AuthShell>
  );
}
