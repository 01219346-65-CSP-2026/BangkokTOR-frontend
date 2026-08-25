"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // placeholder, later setup api calls here
    console.log("Log in submitted:", { email, password });
  }

  function handleGoogleLogin() {
    // same as above 
    console.log("Continue with Google clicked");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center p-6">
      <Image
        src="/loginbackground.png"
        alt=""
        fill
        priority
        className="-z-10 object-cover"
      />

      <div className="w-full max-w-md rounded-[2rem] bg-white p-10 shadow-2xl sm:p-12">
        <p className="text-sm text-zinc-500">space for the logo</p>

        <h1 className="font-display mt-6 text-4xl tracking-tight text-green-600">
          LOG IN
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-zinc-800"
            >
              E-Mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Username@gmail.com"
              className="w-full rounded-full border-2 border-green-400 bg-green-300/50 px-5 py-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-emerald-800/60 focus:border-green-600"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-zinc-800"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="w-full rounded-full border-2 border-green-400 bg-green-300/50 px-5 py-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-emerald-800/60 focus:border-green-600"
            />
            <Link
              href="/forgot-password"
              className="mt-1.5 inline-block text-xs text-zinc-600 hover:text-zinc-900 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            className="mt-1 rounded-full bg-green-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700"
          >
            Log In
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white py-3 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-700">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-green-600 hover:underline"
          >
            Create One
          </Link>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.81.54-1.85.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.16.28-1.7V4.97H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.03l2.97-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .98 4.97l2.97 2.33C4.66 5.17 6.65 3.58 9 3.58Z"
      />
    </svg>
  );
}