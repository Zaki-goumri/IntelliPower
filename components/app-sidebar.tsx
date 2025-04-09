"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Thermometer,
  Shield,
  BrainCircuit,
  Settings,
  Users,
  Bell,
  HelpCircle,
  Server,
} from "lucide-react"
import Logo from "@/components/logo"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Temperature Control",
    href: "/temperature",
    icon: <Thermometer className="h-5 w-5" />,
  },
  {
    title: "Security",
    href: "/security",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    title: "AI Analytics",
    href: "/analytics",
    icon: <BrainCircuit className="h-5 w-5" />,
  },
  {
    title: "Data Center",
    href: "/datacenter",
    icon: <Server className="h-5 w-5" />,
  },
  {
    title: "User Management",
    href: "/users",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: <Bell className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
  {
    title: "Help & Support",
    href: "/help",
    icon: <HelpCircle className="h-5 w-5" />,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-4">
          <Logo size="md" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link href={item.href}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              AS
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@example.com</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
