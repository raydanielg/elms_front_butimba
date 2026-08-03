"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import Link from "next/link";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Simulate API call - replace with actual endpoint when backend supports it
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 shadow-xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Form Side */}
          <div className="p-6 md:p-8">
            {!sent ? (
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  {/* Logo & Back Link */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2.5">
                      <Image
                        src="/logo/butimbalogo-removebg-preview.png"
                        alt="Butimba Teachers College Logo"
                        width={40}
                        height={40}
                        className="object-contain"
                        style={{ width: "auto", height: "40px" }}
                        priority
                      />
                      <div className="flex flex-col items-start">
                        <span className="text-lg font-bold leading-none tracking-tight">ELMS</span>
                        <span className="text-[10px] text-muted-foreground leading-none mt-0.5">Butimba Teachers College</span>
                      </div>
                    </div>
                    <Link
                      href="/auth"
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                    >
                      <ArrowLeft className="size-4" />
                      Back to login
                    </Link>
                  </div>

                  {/* Title */}
                  <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                      Forgot password?
                    </h1>
                    <p className="text-balance text-sm text-muted-foreground">
                      No worries — enter your email and we&apos;ll send you reset instructions.
                    </p>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive animate-fade-in">
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Email */}
                  <Field>
                    <FieldLabel htmlFor="email" className="text-sm font-medium">Email</FieldLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        autoComplete="email"
                        className="h-11 pl-10 text-sm"
                      />
                    </div>
                  </Field>

                  {/* Submit */}
                  <Field>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-11 text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner className="size-4" />
                          Sending...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 py-12 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="size-8 text-primary" />
                </div>
                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
                  <p className="text-balance text-sm text-muted-foreground max-w-sm">
                    We&apos;ve sent a password reset link to{" "}
                    <span className="font-medium text-foreground">{email}</span>.
                    The link will expire in 60 minutes.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  className="mt-2"
                  onClick={() => {
                    setSent(false);
                    setEmail("");
                  }}
                >
                  Try a different email
                </Button>
                <Link
                  href="/auth"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
                >
                  Back to login
                </Link>
              </div>
            )}
          </div>

          {/* Image Side */}
          <div className="relative hidden bg-muted md:block">
            <img
              src="/images/HQSTUDIOS_70.JPG"
              alt="Butimba Teachers College"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.4] dark:grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-primary/10" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-white">
              <div className="text-center">
                <h2 className="text-3xl font-bold leading-tight drop-shadow-lg">
                  Butimba Teachers
                  <br />
                  College
                </h2>
                <p className="mt-3 text-sm text-white/90 max-w-xs drop-shadow">
                  Empowering educators with modern learning tools — access courses, assignments, and materials all in one place.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center text-xs text-muted-foreground">
        Remember your password?{" "}
        <Link href="/auth" className="underline hover:text-foreground">
          Sign in
        </Link>
      </FieldDescription>
    </div>
  );
}
