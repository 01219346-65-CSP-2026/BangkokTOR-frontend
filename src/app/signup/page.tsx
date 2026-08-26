"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { AuthShell } from "../components/auth/AuthShell";
import { TextField } from "../components/ui/TextField";
import { Button } from "../components/ui/Button";

export default function SignUpPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setError(null);
    console.log("Sign up submitted:", { firstName, lastName, email, password });

    router.push("/signup/skills");
  }

  return (
    <AuthShell maxWidthClassName="max-w-lg">
      <h1 className="font-display mt-6 text-4xl tracking-tight text-green-600">
        SIGN UP
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            id="firstName"
            name="firstName"
            label="First Name"
            type="text"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="First Name"
          />
          <TextField
            id="lastName"
            name="lastName"
            label="Last Name"
            type="text"
            autoComplete="family-name"
            required
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Last Name"
          />
        </div>

        <TextField
          id="email"
          name="email"
          label="E-Mail"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Username@gmail.com"
        />

        <TextField
          id="password"
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
        />

        <TextField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Password"
        />

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <Button type="submit" fullWidth>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-700">
        <span>Already Have an account?</span>
        <br />
        <Link
          href="/login"
          className="font-medium text-green-600 hover:underline"
        >
          Log In
        </Link>
      </p>
    </AuthShell>
  );
}