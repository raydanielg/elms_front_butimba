import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="flex min-h-svh">
      {/* Sidebar skeleton */}
      <div className="hidden w-64 shrink-0 border-r bg-sidebar md:block">
        <div className="flex items-center gap-2.5 p-4">
          <Skeleton className="size-8 rounded-lg" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-2.5 w-32" />
          </div>
        </div>
        <div className="space-y-2 p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 p-4">
        <Skeleton className="h-16 w-full rounded-lg" />
        <div className="mt-4 space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Skeleton className="h-96 rounded-xl lg:col-span-4" />
            <Skeleton className="h-96 rounded-xl lg:col-span-3" />
          </div>
        </div>
      </div>
    </div>
  )
}
