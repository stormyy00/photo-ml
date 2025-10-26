"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/utils/auth-client";
import type { ErrorContext } from "better-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const Reset = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const passwordValid = password.length >= 8;
  const matchValid = confirm.length > 0 && password === confirm;

  const validate = () => {
    if (!password.trim()) {
      setFormError("Password is required.");
      return;
    }
    if (!passwordValid) {
      setFormError("Password must be at least 8 characters long.");
      return false;
    }
    if (!matchValid) {
      setFormError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!validate()) return;
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    setLoading(true);

    try {
      await authClient.resetPassword(
        { newPassword: password, token: token || "" },
        {
          onRequest: () => {
            setFormError(null);
            setSuccessMessage(null);
          },
          onSuccess: async () => {
            setLoading(false);
            setSuccessMessage(
              "Password reset successful! You can now sign in.",
            );
            toast.success("Password reset successful");
          },
          onError: (ctx: ErrorContext) => {
            setLoading(false);
            const errorMsg =
              ctx.error.message || "Invalid credentials. Please try again.";
            setFormError(errorMsg);
            toast.error(errorMsg);
          },
        },
      );
    } catch (error) {
      setLoading(false);
      const errorMsg = "An unexpected error occurred. Please try again.";
      if (error instanceof Error) {
        console.error("SignIn error:", error);
      }
      setFormError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-photo-green-300 p-6 sm:p-10">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(80%_50%_at_50%_-10%,rgba(0,0,0,0.10),transparent_60%)]" />

      <div className="w-full max-w-md">
        <Card className="border border-white/40 shadow-sm transition-shadow duration-300 hover:shadow-md">
          {successMessage ? (
            <CardContent className="py-16 flex flex-col items-center justify-center text-center space-y-6">
              <CheckCircle className="h-10 w-10 text-photo-green-300" />
              <h2 className="text-xl font-semibold text-photo-green-300">
                Success!
              </h2>
              <p className="text-sm text-photo-stone-600 max-w-sm">
                Your password has been reset successfully. You can now return to
                the login page.
              </p>
              <Button
                onClick={() => router.push("/signin")}
                className="bg-photo-green-300 text-photo-white-100 hover:bg-photo-green-400"
              >
                Return to Login
              </Button>
            </CardContent>
          ) : (
            <>
              <CardHeader className="space-y-1">
                <CardTitle className="text-center text-2xl font-semibold text-photo-green-300">
                  Reset Password
                </CardTitle>
                <p className="text-center text-sm text-muted-foreground">
                  Enter your new password below.
                </p>
              </CardHeader>

              <CardContent className="space-y-5">
                <form
                  onSubmit={onSubmit}
                  className="space-y-4"
                  aria-busy={loading}
                >
                  <div className="relative">
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <Lock className="pointer-events-none absolute left-3 top-1/3 h-4 w-4 -translate-y-1/2 text-photo-stone-400" />
                    <Input
                      id="password"
                      placeholder="Password (min 8 chars)"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                      aria-invalid={password.length > 0 && !passwordValid}
                      className="pl-10 pr-10 bg-photo-white-100 text-photo-stone-900 border border-photo-stone-200 focus-visible:ring-2 focus-visible:ring-photo-green-300"
                    />
                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2.5 top-1/3 -translate-y-1/2 rounded-md p-1 text-photo-stone-500 hover:bg-photo-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-photo-green-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <p className="mt-1 text-xs text-photo-stone-500">
                      Use at least 8 characters.
                    </p>
                  </div>

                  <div className="relative">
                    <label htmlFor="confirm" className="sr-only">
                      Confirm password
                    </label>
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-photo-stone-400" />
                    <Input
                      id="confirm"
                      placeholder="Confirm password"
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      autoComplete="new-password"
                      required
                      aria-invalid={confirm.length > 0 && !matchValid}
                      className="pl-10 pr-10 bg-photo-white-100 text-photo-stone-900 border border-photo-stone-200 focus-visible:ring-2 focus-visible:ring-photo-green-300"
                    />
                    <button
                      type="button"
                      aria-label={
                        showConfirm
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      onClick={() => setShowConfirm((s) => !s)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-photo-stone-500 hover:bg-photo-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-photo-green-300"
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    {confirm.length > 0 && !matchValid && (
                      <p className="mt-1 text-xs text-photo-rose-600">
                        Passwords do not match.
                      </p>
                    )}
                  </div>

                  {formError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                  )}

                  {successMessage && (
                    <Alert variant="success">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-photo-green-300 text-photo-white-100 hover:bg-photo-green-400 focus-visible:ring-2 focus-visible:ring-photo-green-300"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Resetting…
                        </>
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Reset;
