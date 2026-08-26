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
    <AuthShell maxWidthClassName="max-w-md">
      <h1 className="font-display mt-6 text-4xl tracking-tight text-green-600">
        {t.heading}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
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
            className="mt-1.5 inline-block text-xs text-zinc-600 hover:text-zinc-900 hover:underline"
          >
            {t.forgotPassword}
          </Link>
        </div>

        <Button type="submit" fullWidth>
          {t.submit}
        </Button>

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
          className="font-semibold text-green-600 hover:underline"
        >
          {t.createOne}
        </Link>
      </p>
    </AuthShell>
  );
}