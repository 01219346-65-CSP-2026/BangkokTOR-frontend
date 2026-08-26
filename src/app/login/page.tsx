"use client";

import Link from "next/link";
import { useState, type SubmitEvent } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { useTranslations } from "@/i18n/LanguageProvider";

export default function LoginPage() {
  const t = useTranslations("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Log in submitted:", { email, password });
  }

  function handleGoogleLogin() {
    console.log("Continue with Google clicked");
  }

  return (
    <AuthShell maxWidthClassName="max-w-[23rem]">
      <h1 className="font-display text-3xl tracking-tight text-moss-700">
        {t.heading}
      </h1>
      <p className="mt-2 text-sm text-zinc-600">{t.subheading}</p>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4" noValidate>
        <TextField
          id="email"
          name="email"
          label={t.emailLabel}
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t.emailPlaceholder}
        />

        <div>
          <TextField
            id="password"
            name="password"
            label={t.passwordLabel}
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t.passwordPlaceholder}
          />
          <Link
            href="/forgot-password"
            className="mt-1.5 inline-block text-xs text-zinc-600 underline-offset-4 hover:text-moss-700 hover:underline"
          >
            {t.forgotPassword}
          </Link>
        </div>

        <Button type="submit" fullWidth>
          {t.submit}
        </Button>

        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="h-px flex-1 bg-sage-100" />
          <span className="font-mono text-xs tracking-widest text-zinc-400 uppercase">
            or
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-sage-100" />
        </div>

        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={handleGoogleLogin}
        >
          <GoogleIcon />
          {t.googleContinue}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-700">
        {t.noAccount}{" "}
        <Link
          href="/signup"
          className="font-medium text-sage-600 underline-offset-4 hover:text-moss-700 hover:underline"
        >
          {t.createOne}
        </Link>
      </p>
    </AuthShell>
  );
}