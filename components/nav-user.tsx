"use client"

import { useRouter } from "next/navigation"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { IconSelector, IconUser, IconBell, IconLogout, IconSettings } from "@tabler/icons-react"
import { getUser, clearAuth } from "@/lib/auth"
import { auth } from "@/lib/services"

export function NavUser() {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const user = getUser()

  const name = user?.name || "Guest"
  const email = user?.email || "guest@butimba.ac.tz"
  const avatar = user?.avatar || ""
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

  async function handleLogout() {
    try {
      await auth.logout()
    } catch {
      // ignore - token might be expired
    }
    clearAuth()
    router.push("/auth")
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <Avatar>
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{name}</span>
              <span className="truncate text-xs">{email}</span>
            </div>
            <IconSelector className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-fit"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar>
                    <AvatarImage src={avatar} alt={name} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{name}</span>
                    <span className="truncate text-xs">{email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/dashboard/settings/profile")}>
                <IconUser />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                <IconSettings />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconBell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
