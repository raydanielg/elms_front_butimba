import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function AssignmentsLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-48" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader><Skeleton className="h-5 w-2/3" /><Skeleton className="h-4 w-1/3" /></CardHeader>
            <CardContent><Skeleton className="h-12 w-full" /></CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
