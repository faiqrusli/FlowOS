"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { trackClick } from "@/lib/click-tracking";
import { registerSchema, type RegisterFormValues } from "@/lib/validation";

export function RegisterForm() {
  const router = useRouter();
  const [notice, setNotice] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function handleRegister(values: RegisterFormValues) {
    setNotice(null);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.name,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError("root.server", {
        type: "server",
        message: signUpError.message,
      });
      return;
    }

    void trackClick("sign_up_button_click");

    if (data.session) {
      router.push("/");
      router.refresh();
      return;
    }

    setNotice(
      "Account created. Check your email and confirm your address before signing in."
    );
  }

  return (
    <AuthShell
      title="Create your account"
      description="Register to start tracking tasks, habits, focus, and reflections."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground underline">
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={errors.name ? "true" : undefined}
            aria-describedby={errors.name ? "register-name-error" : undefined}
            {...register("name")}
          />
          {errors.name && (
            <p id="register-name-error" className="text-sm text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={errors.email ? "register-email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p id="register-email-error" className="text-sm text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 6 characters"
            aria-invalid={errors.password ? "true" : undefined}
            aria-describedby={errors.password ? "register-password-error" : undefined}
            {...register("password")}
          />
          {errors.password && (
            <p id="register-password-error" className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            aria-invalid={errors.confirmPassword ? "true" : undefined}
            aria-describedby={
              errors.confirmPassword ? "register-confirm-password-error" : undefined
            }
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p
              id="register-confirm-password-error"
              className="text-sm text-destructive"
            >
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {notice && (
          <p
            role="status"
            aria-live="polite"
            className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900"
          >
            {notice}
          </p>
        )}

        {errors.root?.server?.message && (
          <p
            role="alert"
            aria-live="assertive"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          >
            {errors.root.server.message}
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full"
        >
          {isSubmitting ? "Creating account…" : "Register"}
        </Button>
      </form>
    </AuthShell>
  );
}
