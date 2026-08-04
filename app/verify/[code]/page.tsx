"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge as BadgeUI } from "@/components/ui/badge"
import { certificateApi } from "@/lib/services"
import type { CertificateVerification } from "@/lib/types"
import { IconCertificate, IconQrcode, IconSearch, IconShieldCheck, IconShieldX, IconAlertCircle } from "@tabler/icons-react"

export default function VerifyPage() {
  const [code, setCode] = useState("")
  const [result, setResult] = useState<CertificateVerification | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function verify() {
    if (!code) return
    setLoading(true)
    setSearched(true)
    try {
      const res = await certificateApi.verify(code)
      setResult(res.data.data)
    } catch {
      setResult({ valid: false, status: "NOT_FOUND" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
            <IconCertificate className="size-8 text-primary" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Certificate Verification</h1>
          <p className="mt-1 text-sm text-muted-foreground">Butimba Teachers College — Verify the authenticity of a certificate</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="py-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <IconQrcode className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  className="w-full rounded-md border bg-background py-2 pl-10 pr-3 text-sm"
                  placeholder="Enter verification code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && verify()}
                />
              </div>
              <Button onClick={verify} disabled={!code || loading} className="gap-1.5">
                <IconSearch className="size-4" />
                {loading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        {searched && result && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                {result.valid ? (
                  <div className="flex size-12 items-center justify-center rounded-full bg-green-50">
                    <IconShieldCheck className="size-6 text-green-600" />
                  </div>
                ) : result.status === "REVOKED" ? (
                  <div className="flex size-12 items-center justify-center rounded-full bg-red-50">
                    <IconShieldX className="size-6 text-red-600" />
                  </div>
                ) : (
                  <div className="flex size-12 items-center justify-center rounded-full bg-orange-50">
                    <IconAlertCircle className="size-6 text-orange-600" />
                  </div>
                )}
                <div>
                  <CardTitle className="text-base">
                    {result.valid ? "Certificate Valid" : result.status === "REVOKED" ? "Certificate Revoked" : "Not Found"}
                  </CardTitle>
                  <CardDescription>
                    {result.valid ? "This certificate is authentic and active" : result.status === "REVOKED" ? "This certificate has been revoked" : "No certificate found with this code"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            {result.valid || result.status === "REVOKED" ? (
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Holder</span>
                  <span className="font-medium">{result.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Program</span>
                  <span className="font-medium">{result.program}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium">{result.type}</span>
                </div>
                {result.grade && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Grade</span>
                    <span className="font-medium">{result.grade}</span>
                  </div>
                )}
                {result.classification && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Classification</span>
                    <span className="font-medium">{result.classification}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Issue Date</span>
                  <span className="font-medium">{result.issued_at ? new Date(result.issued_at).toLocaleDateString() : "—"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <BadgeUI variant={result.valid ? "default" : "destructive"}>{result.status}</BadgeUI>
                </div>
              </CardContent>
            ) : (
              <CardContent>
                <p className="text-sm text-muted-foreground">The verification code <code className="font-mono">{code}</code> does not match any issued certificate.</p>
              </CardContent>
            )}
          </Card>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Butimba Teachers College · Certificate Verification System
        </p>
      </div>
    </div>
  )
}
