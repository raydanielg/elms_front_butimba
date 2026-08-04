"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { applicantApi, programsApi } from "@/lib/services"
import { getUser, clearAuth } from "@/lib/auth"
import { AlertCircle, Upload, FileText } from "lucide-react"
import type { Program } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { IconLogout, IconArrowLeft } from "@tabler/icons-react"

const COURSES = [
  "Stashahada ya Ualimu Elimu ya Msingi Mchepuo wa Sayansi ya Jamii",
  "Stashahada ya Ualimu Elimu ya Msingi Mchepuo wa Sayansi na Hisabati",
  "Stashahada ya Ualimu Elimu ya Msingi mchepuo wa Sanaa na Michezo",
  "Stashahada ya Ualimu Elimu ya Msingi mchepuo wa Lugha",
]

export default function ApplyPage() {
  const user = getUser()
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paySlipFile, setPaySlipFile] = useState<File | null>(null)
  const [paySlipUrl, setPaySlipUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    email: user?.email || "",
    full_name: user?.full_name || "",
    gender: "",
    dob: "",
    region: "",
    district: "",
    ward: "",
    address: "",
    phone: user?.phone || "",
    relative_phone: "",
    employment_status: "",
    previous_profession: "",
    college_name: "",
    graduation_year: "",
    certificate_number: "",
    applied_course: "",
    program_id: "",
    mode: "ODL",
    declaration: false,
  })

  useEffect(() => {
    programsApi.list().then(res => setPrograms(res.data.data || [])).catch(() => {})
  }, [])

  function update<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleUploadPaySlip(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPaySlipFile(file)
    setUploading(true)
    try {
      const res = await applicantApi.uploadPaySlip(file)
      const fileId = res.data?.data?.id || null
      if (fileId) {
        setPaySlipUrl(fileId)
      }
    } catch {
      setError("Failed to upload pay slip. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.declaration) {
      setError("Please accept the declaration to continue.")
      return
    }

    if (!form.program_id) {
      setError("Please select a programme.")
      return
    }

    setLoading(true)

    try {
      const formData: Record<string, unknown> = {
        email: form.email,
        full_name: form.full_name,
        gender: form.gender,
        dob: form.dob,
        region: form.region,
        district: form.district,
        ward: form.ward,
        address: form.address,
        phone: form.phone,
        relative_phone: form.relative_phone,
        employment_status: form.employment_status,
        previous_profession: form.previous_profession,
        college_name: form.college_name,
        graduation_year: form.graduation_year,
        certificate_number: form.certificate_number,
        applied_course: form.applied_course,
      }

      await applicantApi.submitApplication({
        program_id: form.program_id,
        mode: form.mode,
        form_data: formData,
        pay_slip_url: paySlipUrl || undefined,
      })

      window.location.href = "/dashboard/application-status"
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: { message?: string }; message?: string } } }
      setError(
        e.response?.data?.error?.message ||
        e.response?.data?.message ||
        "Failed to submit application. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    clearAuth()
    window.location.href = "/auth"
  }

  return (
    <div className="min-h-screen bg-muted/30 bg-wave-pattern">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur dark:bg-card/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo/butimbalogo-removebg-preview.png"
              alt="Butimba"
              width={36}
              height={36}
              className="object-contain"
              style={{ width: "auto", height: "36px" }}
              priority
            />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-tight">ELMS</span>
              <span className="text-[10px] text-muted-foreground">Butimba Teachers College</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary dark:text-primary">
              <IconArrowLeft className="size-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Link>
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <IconLogout className="size-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 dark:from-primary dark:to-primary/80">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <h1 className="text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">Online Application Form</h1>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-primary-foreground/70">
            <Link href="/dashboard" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/dashboard" className="hover:underline">Admissions</Link>
            <span>/</span>
            <span className="font-medium">Apply Now</span>
          </div>
        </div>
      </section>

      {/* Form Content */}
      <section className="py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-6">
            <h2 className="mb-2 inline-block border-b-2 border-primary pb-2 text-2xl font-bold text-primary dark:text-primary-foreground">
              Application for Diploma (Distance Learning)
            </h2>
            <p className="text-sm text-muted-foreground">Fill in all required fields to submit your application</p>
          </div>

          {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0 translate-y-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-extrabold uppercase tracking-widest flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">01</span>
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field>
                <FieldLabel className="text-[11px] font-bold uppercase">Email Address *</FieldLabel>
                <Input type="email" required value={form.email} onChange={e => update("email", e.target.value)} placeholder="mfano@gmail.com" />
              </Field>
              <Field>
                <FieldLabel className="text-[11px] font-bold uppercase">Full Name (As per certificates) *</FieldLabel>
                <Input type="text" required value={form.full_name} onChange={e => update("full_name", e.target.value)} placeholder="Jina lako kamili" />
              </Field>
              <Field>
                <FieldLabel className="text-[11px] font-bold uppercase">Gender *</FieldLabel>
                <NativeSelect className="w-full" value={form.gender} onChange={e => update("gender", e.target.value)} required>
                  <NativeSelectOption value="">-- Select Gender --</NativeSelectOption>
                  <NativeSelectOption value="Mke">Mke (Female)</NativeSelectOption>
                  <NativeSelectOption value="Mme">Mme (Male)</NativeSelectOption>
                </NativeSelect>
              </Field>
              <Field>
                <FieldLabel className="text-[11px] font-bold uppercase">Date of Birth *</FieldLabel>
                <Input type="date" required value={form.dob} onChange={e => update("dob", e.target.value)} />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Section 2: Residence & Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-extrabold uppercase tracking-widest flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">02</span>
              Residence & Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Field>
                <FieldLabel className="text-[11px] font-bold uppercase">Region *</FieldLabel>
                <Input type="text" required value={form.region} onChange={e => update("region", e.target.value)} placeholder="Mfano: Mwanza" />
              </Field>
              <Field>
                <FieldLabel className="text-[11px] font-bold uppercase">District *</FieldLabel>
                <Input type="text" required value={form.district} onChange={e => update("district", e.target.value)} placeholder="Mfano: Nyamagana" />
              </Field>
              <Field>
                <FieldLabel className="text-[11px] font-bold uppercase">Ward *</FieldLabel>
                <Input type="text" required value={form.ward} onChange={e => update("ward", e.target.value)} placeholder="Mfano: Ilemela" />
              </Field>
            </FieldGroup>
            <FieldGroup className="mt-5">
              <Field>
                <FieldLabel className="text-[11px] font-bold uppercase">Current Postal Address *</FieldLabel>
                <Textarea required value={form.address} onChange={e => update("address", e.target.value)} rows={2} placeholder="Anuani yako ya sasa ya makazi..." />
              </Field>
            </FieldGroup>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <Field>
                <FieldLabel className="text-[11px] font-bold uppercase">Applicant&apos;s Phone Number *</FieldLabel>
                <Input type="tel" required value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="0XXXXXXXXX" />
              </Field>
              <Field>
                <FieldLabel className="text-[11px] font-bold uppercase">Relative&apos;s Phone Number *</FieldLabel>
                <Input type="tel" required value={form.relative_phone} onChange={e => update("relative_phone", e.target.value)} placeholder="0XXXXXXXXX" />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Section 3: Academic & Professional */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-extrabold uppercase tracking-widest flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">03</span>
              Academic & Professional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel className="text-[11px] font-bold uppercase">Employment Status *</FieldLabel>
                <RadioGroup value={form.employment_status} onValueChange={v => update("employment_status", v as string)}>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <RadioGroupItem value="Nimeajiriwa" />
                      <span className="text-sm">Nimeajiriwa (Employed)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <RadioGroupItem value="Sijaajiriwa" />
                      <span className="text-sm">Sijaajiriwa (Unemployed)</span>
                    </label>
                  </div>
                </RadioGroup>
              </Field>
            </FieldGroup>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <Field>
                <FieldLabel className="text-[11px] font-bold uppercase">Previous Profession *</FieldLabel>
                <NativeSelect className="w-full" value={form.previous_profession} onChange={e => update("previous_profession", e.target.value)} required>
                  <NativeSelectOption value="">-- Select Qualification --</NativeSelectOption>
                  <NativeSelectOption value="Astashahada ya Ualimu Elimu ya Msingi">Astashahada ya Ualimu Elimu ya Msingi</NativeSelectOption>
                  <NativeSelectOption value="Astashahada ya Ualimu Elimu ya Awali">Astashahada ya Ualimu Elimu ya Awali</NativeSelectOption>
                </NativeSelect>
              </Field>
              <Field>
                <FieldLabel className="text-[11px] font-bold uppercase">College Attended *</FieldLabel>
                <Input type="text" required value={form.college_name} onChange={e => update("college_name", e.target.value)} placeholder="mfano: Butimba Teachers College" />
              </Field>
              <Field>
                <FieldLabel className="text-[11px] font-bold uppercase">Graduation Year *</FieldLabel>
                <Input type="number" required value={form.graduation_year} onChange={e => update("graduation_year", e.target.value)} placeholder="mfano: 2020" />
              </Field>
              <Field>
                <FieldLabel className="text-[11px] font-bold uppercase">Certificate Number *</FieldLabel>
                <Input type="text" required value={form.certificate_number} onChange={e => update("certificate_number", e.target.value)} placeholder="mfano: CSEE/2020/xxxxx" />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Section 4: Programme Choice */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-extrabold uppercase tracking-widest flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">04</span>
              Programme Choice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel className="text-[11px] font-bold uppercase">Study Mode *</FieldLabel>
                <NativeSelect className="w-full" value={form.mode} onChange={e => update("mode", e.target.value)}>
                  <NativeSelectOption value="ODL">ODL (Open & Distance Learning)</NativeSelectOption>
                  <NativeSelectOption value="DAY">DAY (Day)</NativeSelectOption>
                  <NativeSelectOption value="BRD">BRD (Boarding)</NativeSelectOption>
                </NativeSelect>
              </Field>
            </FieldGroup>

            {programs.length > 0 && (
              <FieldGroup className="mt-5">
                <Field>
                  <FieldLabel className="text-[11px] font-bold uppercase">Select Programme *</FieldLabel>
                  <NativeSelect className="w-full" value={form.program_id} onChange={e => update("program_id", e.target.value)} required>
                    <NativeSelectOption value="">-- Select Programme --</NativeSelectOption>
                    {programs.map(p => (
                      <NativeSelectOption key={p.id} value={p.id}>{p.name} ({p.code})</NativeSelectOption>
                    ))}
                  </NativeSelect>
                </Field>
              </FieldGroup>
            )}

            <FieldGroup className="mt-5">
              <FieldLabel className="text-[11px] font-bold uppercase tracking-wider">Select one course only *</FieldLabel>
              <RadioGroup value={form.applied_course} onValueChange={v => update("applied_course", v as string)}>
                <div className="grid grid-cols-1 gap-2">
                  {COURSES.map(course => (
                    <label key={course} className="flex items-center gap-3 p-3 rounded-lg border border-input cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value={course} />
                      <span className="text-sm font-medium">{course}</span>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Section 5: Pay Slip Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-extrabold uppercase tracking-widest flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">05</span>
              Application Fee Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Application fee of <span className="font-bold">TSh 5,000/=</span> is required. Upload your pay slip below.
            </p>
            <div className="flex flex-col gap-3">
              <label className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="size-8 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {paySlipFile ? paySlipFile.name : "Click to upload pay slip"}
                </span>
                <span className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</span>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleUploadPaySlip} />
              </label>
              {uploading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Spinner className="size-4" /> Uploading...
                </div>
              )}
              {paySlipUrl && !uploading && (
                <div className="flex items-center gap-2 text-sm text-primary">
                  <FileText className="size-4" /> Pay slip uploaded successfully
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Declaration */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <Checkbox
                checked={form.declaration}
                onCheckedChange={(v) => update("declaration", v as boolean)}
                id="declaration"
                className="mt-1"
              />
              <label htmlFor="declaration" className="text-[13px] leading-relaxed cursor-pointer">
                Nathibitisha kuwa taarifa zote nilizotoa hapo juu ni za kweli na sahihi. Aidha, ninaelewa kwamba endapo itabainika kuwa nimetoa taarifa za uongo au zisizo sahihi, nitawajibika kwa mujibu wa sheria, kanuni na taratibu husika. <span className="text-destructive font-bold">*</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="submit"
            size="lg"
            className="flex-1"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner className="size-4" />
                Submitting...
              </>
            ) : (
              "Wasilisha Maombi (Submit Application)"
            )}
          </Button>
        </div>
      </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6 dark:border-border dark:bg-card">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-muted-foreground sm:px-6">
          &copy; {new Date().getFullYear()} Butimba Teachers College. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
