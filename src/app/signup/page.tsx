"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "@/i18n/LanguageProvider";

export default function SignUpPage() {
  const router = useRouter();
  const t = useTranslations("signup");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasPasswordMismatch, setHasPasswordMismatch] = useState(false);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setHasPasswordMismatch(true);
      return;
    }
    setHasPasswordMismatch(false);

    // TODO: send { firstName, lastName, email, password } to the sign-up API once it exists.
    console.log("Sign up submitted:", { firstName, lastName, email, password });

    router.push("/signup/skills");
  }

  return (
    <AuthShell maxWidthClassName="max-w-lg">
      <h1 className="font-display mt-6 text-4xl tracking-tight text-green-600">
        {t.heading}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            id="firstName"
            name="firstName"
            label={t.firstNameLabel}
            type="text"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder={t.firstNamePlaceholder}
          />
          <TextField
            id="lastName"
            name="lastName"
            label={t.lastNameLabel}
            type="text"
            autoComplete="family-name"
            required
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder={t.lastNamePlaceholder}
          />
        </div>

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

        <TextField
          id="password"
          name="password"
          label={t.passwordLabel}
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={t.passwordPlaceholder}
        />

        <TextField
          id="confirmPassword"
          name="confirmPassword"
          label={t.confirmPasswordLabel}
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder={t.confirmPasswordPlaceholder}
        />

        {hasPasswordMismatch && (
          <p role="alert" className="text-sm text-red-600">
            {t.passwordMismatch}
          </p>
        )}

        <Button type="submit" fullWidth>
          {t.submit}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm">
        <span className="text-green-600">{t.alreadyHaveAccount}</span>
        <br />
        <Link
          href="/login"
          className="font-medium text-zinc-800 hover:underline"
        >
          {t.logIn}
        </Link>
      </p>
    </AuthShell>
  );
}