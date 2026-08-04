"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Spinner } from "@/components/ui/spinner"
import { auth } from "@/lib/services"
import { getUser, setAuth, getToken } from "@/lib/auth"
import { AlertCircle } from "lucide-react"

export function ProfileSettings() {
  const user = getUser()
  const [full_name, setFullName] = useState(user?.full_name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const initials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      await auth.updateProfile({ full_name, email, phone })
      if (user && getToken()) {
        setAuth(getToken()!, { ...user, full_name, email, phone })
      }
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="size-16">
                <AvatarImage src={user?.photo_url || ""} alt={full_name} />
                <AvatarFallback>{initials(full_name)}</AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline" size="sm">Change Photo</Button>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="size-4 shrink-0 translate-y-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-600">
                Profile updated successfully
              </div>
            )}

            <Field>
              <FieldLabel htmlFor="full_name">Full Name</FieldLabel>
              <Input id="full_name" value={full_name} onChange={(e) => setFullName(e.target.value)} required />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Field>

            <Field>
              <FieldLabel htmlFor="phone">Phone</FieldLabel>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optional" />
            </Field>

            <Button type="submit" disabled={loading}>
              {loading ? <><Spinner className="size-4" /> Saving...</> : "Save Changes"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
