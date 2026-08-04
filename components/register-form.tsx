"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { auth } from "@/lib/services"
import { setAuth } from "@/lib/auth"
import { AlertCircle, Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { LegalDrawers } from "@/components/legal-drawers"
import Image from "next/image"
import Link from "next/link"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    let raw = e.target.value.replace(/\D/g, "")
    if (raw.length > 0 && !/^[67]/.test(raw)) {
      raw = raw.substring(1)
    }
    if (raw.length > 9) raw = raw.substring(0, 9)
    setPhone(raw)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.")
      return
    }

    if (phone && !/^[67]\d{8}$/.test(phone)) {
      setError("Phone number must be 9 digits starting with 7 or 6.")
      return
    }

    setLoading(true)

    try {
      const res = await auth.register({
        full_name: fullName,
        email,
        password,
        password_confirmation: passwordConfirmation,
        phone: phone ? `255${phone}` : undefined,
      })
      setAuth(res.data.data.access_token, res.data.data.user)
      window.location.href = "/dashboard/apply"
    } catch (err: any) {
      const msg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.response?.data?.errors?.email?.[0] ||
        err.response?.data?.errors?.password?.[0] ||
        err.response?.data?.errors?.full_name?.[0] ||
        err.response?.data?.errors?.phone?.[0] ||
        "Registration failed. Please try again."
      setError(msg)
    } finally {
      setLoading(false)
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
                  <h1 className="text-2xl font-bold tracking-tight">Create Account</h1>
                  <p className="text-balance text-sm text-muted-foreground">
                    Join Butimba Teachers College today
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

              {/* Full Name */}
              <Field>
                <FieldLabel htmlFor="full_name" className="text-sm font-medium">Full Name</FieldLabel>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="full_name"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                    autoComplete="name"
                    className="h-11 pl-10 text-sm"
                  />
                </div>
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="reg-email" className="text-sm font-medium">Email Address</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    autoComplete="email"
                    className="h-11 pl-10 text-sm"
                  />
                </div>
              </Field>

              {/* Phone */}
              <Field>
                <FieldLabel htmlFor="phone" className="text-sm font-medium">Phone Number</FieldLabel>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-0">
                    <div className="flex items-center gap-1.5 bg-muted border-r border-input px-3 rounded-l-lg h-11">
                      <span className="text-xs font-bold text-muted-foreground select-none">+255</span>
                    </div>
                  </div>
                  <Phone className="absolute left-[88px] top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    placeholder="7XX XXX XXX"
                    value={phone}
                    onChange={handlePhoneChange}
                    disabled={loading}
                    autoComplete="tel"
                    maxLength={9}
                    className="h-11 pl-[112px] text-sm font-mono tracking-wide"
                  />
                </div>
                <FieldDescription className="text-[11px] text-muted-foreground">
                  Enter 9 digits starting with 7 or 6
                </FieldDescription>
              </Field>

              {/* Password */}
              <Field>
                <FieldLabel htmlFor="reg-password" className="text-sm font-medium">Password</FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="new-password"
                    className="h-11 pl-10 pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </Field>

              {/* Confirm Password */}
              <Field>
                <FieldLabel htmlFor="password-confirm" className="text-sm font-medium">Confirm Password</FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password-confirm"
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    required
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    disabled={loading}
                    autoComplete="new-password"
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
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Field>

              {/* Login link */}
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/auth"
                  className="font-semibold text-primary underline-offset-2 hover:underline transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </FieldGroup>
          </form>

          {/* Image Side */}
          <div className="relative hidden bg-muted md:block">
            <img
              src="/images/HQSTUDIOS_61.JPG"
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
        By creating an account, you agree to the{" "}
        <LegalDrawers />
        .
      </FieldDescription>
    </div>
  )
}
