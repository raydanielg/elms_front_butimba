"use client"

import { useState, useEffect } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  IconFileText,
  IconShieldCheck,
  IconScale,
  IconUser,
  IconBan,
  IconAlertTriangle,
  IconCheck,
  IconLock,
  IconEye,
  IconShare,
} from "@tabler/icons-react"

type LegalType = "terms" | "privacy" | null

export function LegalDrawers() {
  const [open, setOpen] = useState<LegalType>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open) {
      Promise.resolve().then(() => setLoading(true))
      const timer = setTimeout(() => setLoading(false), 800)
      return () => clearTimeout(timer)
    }
  }, [open])

  return (
    <>
      <button
        onClick={() => setOpen("terms")}
        className="underline hover:text-foreground transition-colors"
      >
        Terms of Service
      </button>
      {" and "}
      <button
        onClick={() => setOpen("privacy")}
        className="underline hover:text-foreground transition-colors"
      >
        Privacy Policy
      </button>

      {/* Terms of Service */}
      <Sheet open={open === "terms"} onOpenChange={(v) => !v && setOpen(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-lg font-bold">
              <IconScale className="size-5 text-primary" />
              Terms of Service
            </SheetTitle>
            <SheetDescription>
              Last updated: August 2026 · Butimba Teachers College
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="flex-1 px-4 pb-4">
            {loading ? (
              <TermsSkeleton />
            ) : (
              <div className="space-y-6 text-sm leading-relaxed">
                <Section icon={<IconFileText className="size-4 text-primary" />} title="1. Acceptance of Terms">
                  By accessing and using the Electronic Learning Management System (ELMS) of Butimba Teachers College, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use this platform.
                </Section>
                <Section icon={<IconUser className="size-4 text-primary" />} title="2. User Accounts">
                  <ul className="space-y-2">
                    <ListItem>Users must provide accurate and complete information when registering.</ListItem>
                    <ListItem>Each user is responsible for maintaining the confidentiality of their account credentials.</ListItem>
                    <ListItem>Accounts are assigned based on your role: Student, Lecturer, or Administrator.</ListItem>
                    <ListItem>Sharing account credentials with others is strictly prohibited.</ListItem>
                  </ul>
                </Section>
                <Section icon={<IconCheck className="size-4 text-primary" />} title="3. Acceptable Use">
                  <ul className="space-y-2">
                    <ListItem>Use the platform solely for educational and academic purposes.</ListItem>
                    <ListItem>Respect the intellectual property rights of lecturers and the institution.</ListItem>
                    <ListItem>Do not upload, share, or distribute inappropriate or offensive content.</ListItem>
                    <ListItem>Do not attempt to disrupt or compromise the security of the platform.</ListItem>
                  </ul>
                </Section>
                <Section icon={<IconBan className="size-4 text-destructive" />} title="4. Prohibited Conduct">
                  <ul className="space-y-2">
                    <ListItem>Plagiarism or submitting work that is not your own.</ListItem>
                    <ListItem>Attempting to access other users&apos; accounts or data.</ListItem>
                    <ListItem>Using automated tools to scrape or download bulk content.</ListItem>
                    <ListItem>Any form of harassment or discrimination against other users.</ListItem>
                  </ul>
                </Section>
                <Section icon={<IconAlertTriangle className="size-4 text-orange-500" />} title="5. Academic Integrity">
                  All submissions must be your original work. Plagiarism, cheating, or any form of academic dishonesty will result in disciplinary action in accordance with Butimba Teachers College policies.
                </Section>
                <Section icon={<IconScale className="size-4 text-primary" />} title="6. Modifications">
                  Butimba Teachers College reserves the right to modify these Terms at any time. Users will be notified of significant changes. Continued use of the platform constitutes acceptance of the updated Terms.
                </Section>
                <div className="rounded-lg bg-muted p-4 text-xs text-muted-foreground">
                  For questions about these Terms, contact the administration at{" "}
                  <span className="font-medium text-foreground">admin@butimba.ac.tz</span>
                </div>
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Privacy Policy */}
      <Sheet open={open === "privacy"} onOpenChange={(v) => !v && setOpen(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-lg font-bold">
              <IconShieldCheck className="size-5 text-primary" />
              Privacy Policy
            </SheetTitle>
            <SheetDescription>
              Last updated: August 2026 · Butimba Teachers College
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="flex-1 px-4 pb-4">
            {loading ? (
              <PrivacySkeleton />
            ) : (
              <div className="space-y-6 text-sm leading-relaxed">
                <Section icon={<IconShieldCheck className="size-4 text-primary" />} title="1. Information We Collect">
                  <ul className="space-y-2">
                    <ListItem><strong>Account data:</strong> Name, email, role, and phone number.</ListItem>
                    <ListItem><strong>Academic data:</strong> Course enrollments, assignments, submissions, and grades.</ListItem>
                    <ListItem><strong>Usage data:</strong> Login times, pages visited, and interaction logs.</ListItem>
                  </ul>
                </Section>
                <Section icon={<IconEye className="size-4 text-primary" />} title="2. How We Use Your Information">
                  <ul className="space-y-2">
                    <ListItem>To provide and manage your learning experience.</ListItem>
                    <ListItem>To track academic progress and generate reports.</ListItem>
                    <ListItem>To communicate important announcements and updates.</ListItem>
                    <ListItem>To maintain academic integrity and platform security.</ListItem>
                  </ul>
                </Section>
                <Section icon={<IconLock className="size-4 text-primary" />} title="3. Data Security">
                  Your data is stored securely using industry-standard encryption. Access is restricted to authorized personnel only. Authentication tokens are used to protect your session.
                </Section>
                <Section icon={<IconShare className="size-4 text-primary" />} title="4. Information Sharing">
                  We do not sell, rent, or share your personal information with third parties. Data is shared internally only with authorized lecturers and administrators for academic purposes.
                </Section>
                <Section icon={<IconUser className="size-4 text-primary" />} title="5. Your Rights">
                  <ul className="space-y-2">
                    <ListItem>Access your personal data and academic records.</ListItem>
                    <ListItem>Request correction of inaccurate information.</ListItem>
                    <ListItem>Request deletion of your account (subject to academic record retention policies).</ListItem>
                  </ul>
                </Section>
                <Section icon={<IconShieldCheck className="size-4 text-primary" />} title="6. Data Retention">
                  Academic records are retained in accordance with Butimba Teachers College and national education policies. Account data is retained while you are an active student or staff member.
                </Section>
                <Section icon={<IconAlertTriangle className="size-4 text-orange-500" />} title="7. Updates to This Policy">
                  We may update this Privacy Policy from time to time. Users will be notified of significant changes. Continued use of the platform constitutes acceptance of the updated policy.
                </Section>
                <div className="rounded-lg bg-muted p-4 text-xs text-muted-foreground">
                  For privacy concerns, contact the administration at{" "}
                  <span className="font-medium text-foreground">admin@butimba.ac.tz</span>
                </div>
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  )
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="flex items-center gap-2 text-base font-semibold">
        {icon}
        {title}
      </h3>
      <div className="text-muted-foreground pl-6">{children}</div>
    </div>
  )
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
      <span>{children}</span>
    </li>
  )
}

function TermsSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="size-5 rounded" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="pl-7 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      ))}
    </div>
  )
}

function PrivacySkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="size-5 rounded" />
            <Skeleton className="h-5 w-52" />
          </div>
          <div className="pl-7 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}
