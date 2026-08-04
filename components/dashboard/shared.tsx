"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { IconChevronRight } from "@tabler/icons-react"

export type KpiCard = {
  title: string
  value: number | string | undefined
  icon: React.ReactNode
  color: string
  subtitle?: string
}

export type QuickAction = {
  label: string
  href: string
  icon: React.ReactNode
}

export function KpiGrid({ cards, loading }: { cards: KpiCard[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: cards.length }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-5 w-24" /><Skeleton className="size-8 rounded-lg" />
            </CardHeader>
            <CardContent><Skeleton className="h-8 w-16" /></CardContent>
          </Card>
        ))}
      </div>
    )
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <div className={`flex size-8 items-center justify-center rounded-lg ${card.color}`}>{card.icon}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value ?? 0}</div>
            {card.subtitle && <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
            >
              {action.icon}
              {action.label}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function WidgetCard({ title, description, children, action }: { title: string; description?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
          </div>
          {action}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      {icon}
      <p className="mt-3 text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const variant = status === "ACCEPTED" || status === "CONFIRMED" || status === "ACTIVE" || status === "COMPLETED"
    ? "default"
    : status === "REJECTED" || status === "REVOKED" || status === "OVERDUE"
    ? "destructive"
    : "secondary"
  return <Badge variant={variant} className="capitalize">{status.toLowerCase()}</Badge>
}
