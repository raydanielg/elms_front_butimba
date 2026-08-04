"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge as BadgeUI } from "@/components/ui/badge"
import { questionBankApi } from "@/lib/services"
import type { QuestionCategory, Question } from "@/lib/types"
import { IconQuestionMark, IconPlus, IconChevronRight } from "@tabler/icons-react"

export default function QuestionBankPage() {
  const [categories, setCategories] = useState<QuestionCategory[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await questionBankApi.listCategories()
        setCategories(res.data.data || [])
      } catch { } finally { setLoading(false) }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    async function fetchQuestions() {
      if (!selectedCategory) return
      try {
        const res = await questionBankApi.listQuestions({ category_id: selectedCategory })
        setQuestions(res.data.data || [])
      } catch { }
    }
    fetchQuestions()
  }, [selectedCategory])

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Question Bank" }]}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Question Bank</h1>
        <Button className="gap-1.5">
          <IconPlus className="size-4" /> New Question
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {/* Categories */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
            ) : categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">No categories yet.</p>
            ) : (
              categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex w-full items-center justify-between rounded-lg border p-2 text-left text-sm hover:bg-muted/50 transition-colors ${selectedCategory === cat.id ? "border-primary bg-primary/5" : ""}`}
                >
                  <span className="font-medium">{cat.name}</span>
                  <span className="flex items-center gap-2">
                    <BadgeUI variant="secondary" className="text-xs">{cat.questions_count ?? 0}</BadgeUI>
                    <IconChevronRight className="size-4 text-muted-foreground" />
                  </span>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        {/* Questions */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Questions</CardTitle>
            <CardDescription>
              {selectedCategory ? `${questions.length} questions in selected category` : "Select a category to view questions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedCategory ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <IconQuestionMark className="size-10 text-muted-foreground/50" />
                <p className="mt-3 text-sm text-muted-foreground">Select a category to view its questions</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <IconQuestionMark className="size-10 text-muted-foreground/50" />
                <p className="mt-3 text-sm text-muted-foreground">No questions in this category yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {questions.map((q) => (
                  <div key={q.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{q.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{q.questiontext}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <BadgeUI variant="outline" className="text-xs">{q.qtype}</BadgeUI>
                      <span className="text-xs text-muted-foreground">{q.defaultmark} marks</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
