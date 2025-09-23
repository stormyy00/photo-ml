"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  User,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import SignInProvider from "@/utils/signIn";
import { authClient } from "@/utils/auth-client";
import { ErrorContext } from "better-auth/react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const emailValid = useMemo(() => EMAIL_RE.test(email.trim()), [email]);
  const passwordValid = password.length >= 8;
  const matchValid = confirm.length > 0 && password === confirm;

  const validate = () => {
    setFormError(null);
    setSuccessMessage(null);

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirm.trim()
    ) {
      setFormError("All fields are required.");
      return false;
    }
    if (!emailValid) {
      setFormError("Please enter a valid email address.");
      return false;
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
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await authClient.signUp.email(
        {
          email,
          password,
          name: `${firstName} ${lastName}`,
        },
        {
          onSuccess: () => {
            setLoading(false);
            setSuccessMessage("Account created successfully!");
            toast.success("Account created successfully!");
          },
          onError: (ctx: ErrorContext) => {
            setLoading(false);
            const errorMsg =
              ctx.error.message ||
              "Failed to create account. Please try again.";
            setFormError(errorMsg);
            toast.error(errorMsg);
          },
        },
      );

      // Simulate API call for now
      // await new Promise(resolve => setTimeout(resolve, 1500));

      // On success
      // setSuccessMessage("Account created successfully!");
      // toast.success("Account created successfully!");

      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirm("");
    } catch (error) {
      const errorMsg = "Failed to create account. Please try again.";
      setFormError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-photo-green-300 p-6 sm:p-10">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(80%_50%_at_50%_-10%,rgba(0,0,0,0.10),transparent_60%)]" />

      <div className="w-full max-w-md">
        <Card className="border border-white/40 shadow-sm transition-shadow duration-300 hover:shadow-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl font-semibold text-photo-green-300">
              Create an account
            </CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              Join and start creating!
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => SignInProvider("google")}
                className="w-full justify-center gap-2 border-photo-stone-200 bg-photo-white-100 hover:bg-photo-stone-50 focus-visible:ring-2 focus-visible:ring-photo-green-300"
              >
                <Image
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  width={18}
                  height={18}
                />
                <span>Google</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => SignInProvider("facebook")}
                className="w-full justify-center gap-2 border-photo-stone-200 bg-photo-white-100 hover:bg-photo-stone-50 focus-visible:ring-2 focus-visible:ring-photo-green-300"
              >
                <Image
                  src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                  alt="Facebook"
                  width={18}
                  height={18}
                />
                <span>Facebook</span>
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-photo-stone-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-photo-white-100 px-2 text-xs text-photo-stone-500">
                  or continue with
                </span>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4" aria-busy={loading}>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="relative">
                  <label htmlFor="first" className="sr-only">
                    First name
                  </label>
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-photo-stone-400" />
                  <Input
                    id="first"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                    required
                    className="pl-10 bg-photo-white-100 text-photo-stone-900 border border-photo-stone-200 focus-visible:ring-2 focus-visible:ring-photo-green-300"
                  />
                </div>
                <div className="relative">
                  <label htmlFor="last" className="sr-only">
                    Last name
                  </label>
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-photo-stone-400" />
                  <Input
                    id="last"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                    required
                    className="pl-10 bg-photo-white-100 text-photo-stone-900 border border-photo-stone-200 focus-visible:ring-2 focus-visible:ring-photo-green-300"
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-photo-stone-400" />
                <Input
                  id="email"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  aria-invalid={email.length > 0 && !emailValid}
                  className="pl-10 bg-photo-white-100 text-photo-stone-900 border border-photo-stone-200 focus-visible:ring-2 focus-visible:ring-photo-green-300"
                />
                {email.length > 0 && !emailValid && (
                  <p className="mt-1 text-xs text-photo-rose-600">
                    Enter a valid email address.
                  </p>
                )}
              </div>

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
                  aria-label={showPassword ? "Hide password" : "Show password"}
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

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-photo-green-300 text-photo-white-100 hover:bg-photo-green-400 focus-visible:ring-2 focus-visible:ring-photo-green-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account…
                  </>
                ) : (
                  "Sign up"
                )}
              </Button>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="text-photo-green-300 underline-offset-2 hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
