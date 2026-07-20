"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSafeRedirectPath } from "@/lib/auth-redirect";
import { isEmailNotConfirmedError } from "@/lib/auth";
import { enterDemoSession } from "@/lib/demo/session";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = getSafeRedirectPath(searchParams.get("next"));
  const callbackError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [enteringDemo, setEnteringDemo] = useState(false);
  const [error, setError] = useState<string | null>(
    callbackError === "confirmation_failed"
      ? "Email confirmation failed. Try signing in again or request a new link."
      : null
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      if (isEmailNotConfirmedError(signInError.message)) {
        setError(
          "Please confirm your email before signing in. Check your inbox for the confirmation link."
        );
      } else {
        setError(signInError.message);
      }
      setSubmitting(false);
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  async function handleEnterDemo() {
    setEnteringDemo(true);
    setError(null);
    try {
      await enterDemoSession();
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not start the demo. Try again.",
      );
      setEnteringDemo(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to continue to your FlowOS dashboard."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-foreground underline">
            Register
          </Link>
        </>
      }
    >
      <div className="space-y-5">
        <div className="space-y-2 rounded-xl border border-border/60 bg-surface-raised px-4 py-3.5">
          <p className="text-sm font-medium text-foreground">Try Live Demo</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            No signup required. Explore every feature in a fully populated
            workspace. Changes are temporary and automatically reset.
          </p>
          <Button
            type="button"
            className="mt-1 w-full"
            disabled={enteringDemo || submitting}
            onClick={() => void handleEnterDemo()}
          >
            {enteringDemo ? "Preparing demo…" : "Enter Demo Workspace"}
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden>
            <div className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wide">
            <span className="bg-card px-2 text-muted-foreground">or sign in</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
              required
            />
          </div>

          {error && (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={submitting || enteringDemo}
            variant="outline"
            className="w-full"
          >
            {submitting ? "Signing in…" : "Login"}
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}
