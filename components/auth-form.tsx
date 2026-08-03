"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import { auth } from "@/lib/services";
import { setAuth } from "@/lib/auth";
import { AlertCircle, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { LegalDrawers } from "@/components/legal-drawers";
import Image from "next/image";
import Link from "next/link";

export function AuthForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slideshowImages = [
    "/images/HQSTUDIOS_61.JPG",
    "/images/HQSTUDIOS_65.JPG",
    "/images/HQSTUDIOS_70.JPG",
    "/images/HQSTUDIOS_75.JPG",
    "/images/HQSTUDIOS_80.JPG",
    "/images/HQSTUDIOS_85.JPG",
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
  }, [slideshowImages.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await auth.login(email, password);
      setAuth(res.data.token, res.data.user);
      router.push("/dashboard");
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.email?.[0] ||
        "Login failed. Please check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 shadow-xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Form Side */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <FieldGroup>
              {/* Logo & Title */}
              <div className="flex flex-col items-center gap-4 text-center">
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
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-bold tracking-tight">
                    Welcome back
                  </h1>
                  <p className="text-balance text-sm text-muted-foreground">
                    Sign in to access your learning dashboard
                  </p>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive animate-fade-in">
                  <AlertCircle className="size-4 shrink-0 translate-y-0.5" />
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

              {/* Password */}
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password" className="text-sm font-medium">Password</FieldLabel>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-muted-foreground underline-offset-2 hover:underline hover:text-primary transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="current-password"
                    className="h-11 pl-10 pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
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
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>

          {/* Image Slideshow Side */}
          <div className="relative hidden bg-muted md:block">
            {slideshowImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="Butimba Teachers College"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                  idx === currentSlide ? "opacity-100" : "opacity-0"
                } dark:brightness-[0.4] dark:grayscale`}
              />
            ))}
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
            {/* Slide indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {slideshowImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentSlide
                      ? "w-6 bg-white"
                      : "w-1.5 bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center text-xs text-muted-foreground">
        By signing in, you agree to the{" "}
        <LegalDrawers />
        .
      </FieldDescription>
    </div>
  );
}
