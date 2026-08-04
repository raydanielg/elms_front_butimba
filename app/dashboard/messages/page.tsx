"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge as BadgeUI } from "@/components/ui/badge"
import { messageApi } from "@/lib/services"
import { getUser } from "@/lib/auth"
import type { Conversation, Message } from "@/lib/types"
import { IconMessage2, IconPlus, IconSend } from "@tabler/icons-react"

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selected, setSelected] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const user = getUser()

  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await messageApi.listConversations()
        setConversations(res.data.data || [])
      } catch { } finally { setLoading(false) }
    }
    fetchConversations()
  }, [])

  async function openConversation(id: string) {
    try {
      const res = await messageApi.showConversation(id)
      setSelected(res.data.data)
      setMessages(res.data.data.messages || [])
      await messageApi.markRead(id)
    } catch { }
  }

  async function sendMessage() {
    if (!newMessage.trim() || !selected) return
    try {
      const res = await messageApi.sendMessage(selected.id, { body: newMessage })
      setMessages([...messages, res.data.data])
      setNewMessage("")
    } catch { }
  }

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Messages" }]}>
      <h1 className="text-2xl font-bold tracking-tight">Messages</h1>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 h-[calc(100vh-12rem)]">
        {/* Conversation list */}
        <Card className="md:col-span-1 lg:col-span-1 overflow-hidden">
          <CardContent className="p-0">
            <div className="border-b p-3">
              <Button variant="outline" size="sm" className="w-full gap-1.5">
                <IconPlus className="size-4" /> New Conversation
              </Button>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 16rem)" }}>
              {loading ? (
                <div className="space-y-2 p-3">
                  {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <IconMessage2 className="size-8 text-muted-foreground/50" />
                  <p className="mt-2 text-xs text-muted-foreground">No conversations</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => openConversation(conv.id)}
                    className={`flex w-full items-center gap-3 border-b p-3 text-left hover:bg-muted/50 transition-colors ${selected?.id === conv.id ? "bg-muted" : ""}`}
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                      <IconMessage2 className="size-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {conv.is_group ? conv.name : conv.members?.find(m => m.user_id !== user?.id)?.user?.full_name || "Conversation"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {conv.messages?.[0]?.body || "No messages yet"}
                      </p>
                    </div>
                    {conv.is_group && <BadgeUI variant="secondary" className="text-xs">Group</BadgeUI>}
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat area */}
        <Card className="md:col-span-2 lg:col-span-3 flex flex-col overflow-hidden">
          {selected ? (
            <>
              <div className="border-b p-3">
                <p className="text-sm font-medium">
                  {selected.is_group ? selected.name : selected.members?.find(m => m.user_id !== user?.id)?.user?.full_name || "Conversation"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selected.members?.length || 0} members
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "calc(100vh - 20rem)" }}>
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.user_id === user?.id ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${msg.user_id === user?.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      {msg.user_id !== user?.id && (
                        <p className="text-xs font-medium opacity-70 mb-0.5">{msg.user?.full_name}</p>
                      )}
                      <p>{msg.body}</p>
                      <p className="text-xs opacity-50 mt-0.5">{msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t p-3">
                <div className="flex gap-2">
                  <input
                    className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <Button size="sm" className="gap-1.5" onClick={sendMessage} disabled={!newMessage.trim()}>
                    <IconSend className="size-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center h-full text-center">
              <IconMessage2 className="size-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">Select a conversation to start chatting</p>
            </CardContent>
          )}
        </Card>
      </div>
    </DashboardShell>
  )
}
