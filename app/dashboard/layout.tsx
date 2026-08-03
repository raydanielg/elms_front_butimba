"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import { Spinner } from "@/components/ui/spinner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth")
    } else {
      setChecked(true)
    }
  }, [router])

  if (!checked) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
