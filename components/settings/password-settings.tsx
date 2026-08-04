"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { auth } from "@/lib/services"
import { AlertCircle } from "lucide-react"

export function PasswordSettings() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (password !== passwordConfirmation) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      await auth.changePassword({ current_password: currentPassword, password, password_confirmation: passwordConfirmation })
      setSuccess(true)
      setCurrentPassword("")
      setPassword("")
      setPasswordConfirmation("")
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: { message?: string }; message?: string } } }
      setError(e.response?.data?.error?.message || e.response?.data?.message || "Failed to change password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>Change your account password</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="size-4 shrink-0 translate-y-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-600">
                Password changed successfully
              </div>
            )}

            <Field>
              <FieldLabel htmlFor="current_password">Current Password</FieldLabel>
              <Input id="current_password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">New Password</FieldLabel>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            </Field>

            <Field>
              <FieldLabel htmlFor="password_confirmation">Confirm New Password</FieldLabel>
              <Input id="password_confirmation" type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required minLength={8} />
            </Field>

            <Button type="submit" disabled={loading}>
              {loading ? <><Spinner className="size-4" /> Updating...</> : "Change Password"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
