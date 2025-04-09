import type React from "react"
import Header from "@/components/header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />
        <SidebarInset>
          <Header />
          <div className="flex-1 overflow-auto">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
