"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSafeRedirectPath } from "@/lib/auth-redirect";
import { isEmailNotConfirmedError } from "@/lib/auth";
import { enterDemoSession } from "@/lib/demo/session";
import { createClient } from "@/lib/supabase/client";
import { trackClick } from "@/lib/click-tracking";
import { loginSchema, type LoginFormValues } from "@/lib/validation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = getSafeRedirectPath(searchParams.get("next"));
  const callbackError = searchParams.get("error");

  const [enteringDemo, setEnteringDemo] = useState(false);
  const [authError, setAuthError] = useState<string | null>(
    callbackError === "confirmation_failed"
      ? "Email confirmation failed. Try signing in again or request a new link."
      : null
  );

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function handleLogin(values: LoginFormValues) {
    setAuthError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (signInError) {
      let message: string;
      if (isEmailNotConfirmedError(signInError.message)) {
        message =
          "Please confirm your email before signing in. Check your inbox for the confirmation link.";
      } else {
        message = signInError.message;
      }
      setError("root.server", {
        type: "server",
        message,
      });
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  async function handleEnterDemo() {
    setEnteringDemo(true);
    setAuthError(null);
    try {
      await enterDemoSession();
      void trackClick("demo_button_click");
      router.push("/");
      router.refresh();
    } catch (err) {
      setAuthError(
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
            disabled={enteringDemo || isSubmitting}
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

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={errors.email ? "true" : undefined}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              {...register("email")}
            />
            {errors.email && (
              <p id="login-email-error" className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
              aria-invalid={errors.password ? "true" : undefined}
              aria-describedby={errors.password ? "login-password-error" : undefined}
              {...register("password")}
            />
            {errors.password && (
              <p id="login-password-error" className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {(authError || errors.root?.server?.message) && (
            <p
              role="alert"
              aria-live="assertive"
              className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {authError ?? errors.root?.server?.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || enteringDemo}
            variant="outline"
            className="w-full"
          >
            {isSubmitting ? "Signing in…" : "Login"}
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}
