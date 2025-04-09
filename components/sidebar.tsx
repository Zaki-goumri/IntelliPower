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
  Menu,
  X,
  Server,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useMobile } from "@/hooks/use-mobile"
import Logo from "@/components/logo"

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

export default function Sidebar() {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {isMobile && (
        <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50" onClick={toggleSidebar}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      )}

      <div
        className={cn(
          "bg-muted h-full w-64 border-r flex-shrink-0 flex flex-col",
          isMobile && "fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-in-out",
          isMobile && !isOpen && "-translate-x-full",
        )}
      >
        <div className="p-6 border-b">
          <Logo size="md" />
        </div>

        <div className="flex-1 px-3 py-2 space-y-1 overflow-auto">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => isMobile && setIsOpen(false)}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  pathname === item.href ? "bg-primary text-primary-foreground" : "transparent",
                )}
              >
                {item.icon}
                {item.title}
              </div>
            </Link>
          ))}
        </div>

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
      </div>

      {isMobile && isOpen && <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setIsOpen(false)} />}
    </>
  )
}
