"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import api from "@/lib/api"
import type { Program } from "@/lib/types"
import { IconBooks, IconPlus } from "@tabler/icons-react"

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  useEffect(() => { fetchPrograms() }, [])

  async function fetchPrograms() {
    try {
      const res = await api.get("/programs")
      setPrograms(res.data.data || [])
    } catch { } finally { setLoading(false) }
  }

  async function createProgram(data: Record<string, unknown>) {
    try {
      await api.post("/programs", data)
      setOpen(false)
      fetchPrograms()
    } catch { }
  }

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Programs" }]}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Programs</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage academic programs</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button size="sm"><IconPlus className="size-4" /> New Program</Button>} />
          <DialogContent>
            <DialogHeader><DialogTitle>Create Program</DialogTitle></DialogHeader>
            <ProgramForm onSubmit={createProgram} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                </TableRow>
              )) : programs.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono font-medium">{p.code}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell><Badge variant="outline">{p.level}</Badge></TableCell>
                  <TableCell>{p.duration_years} years</TableCell>
                  <TableCell><Badge variant={p.is_active ? "default" : "secondary"}>{p.is_active ? "Active" : "Inactive"}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {!loading && programs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <IconBooks className="size-12 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">No programs found</p>
        </div>
      )}
    </DashboardShell>
  )
}

function ProgramForm({ onSubmit }: { onSubmit: (data: Record<string, unknown>) => void }) {
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [level, setLevel] = useState("DIPLOMA")
  const [durationYears, setDurationYears] = useState("2")
  const [description, setDescription] = useState("")

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ code, name, level, duration_years: parseInt(durationYears), description }) }}>
      <FieldGroup>
        <Field><FieldLabel>Code</FieldLabel><Input value={code} onChange={e => setCode(e.target.value)} required placeholder="DSE-SCI" /></Field>
        <Field><FieldLabel>Name</FieldLabel><Input value={name} onChange={e => setName(e.target.value)} required placeholder="Diploma in Secondary Education" /></Field>
        <Field><FieldLabel>Level</FieldLabel>
          <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={level} onChange={e => setLevel(e.target.value)}>
            <option>CERTIFICATE</option><option>DIPLOMA</option><option>DEGREE</option><option>MASTERS</option>
          </select>
        </Field>
        <Field><FieldLabel>Duration (years)</FieldLabel><Input type="number" value={durationYears} onChange={e => setDurationYears(e.target.value)} required /></Field>
        <Field><FieldLabel>Description</FieldLabel><Input value={description} onChange={e => setDescription(e.target.value)} /></Field>
        <Button type="submit" className="w-full">Create Program</Button>
      </FieldGroup>
    </form>
  )
}
