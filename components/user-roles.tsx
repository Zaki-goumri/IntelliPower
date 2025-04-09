"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Plus, Settings, Eye, PenToolIcon as Tool, ShieldAlert } from "lucide-react"

type Role = {
  id: string
  name: string
  description: string
  userCount: number
  icon: React.ReactNode
}

const roles: Role[] = [
  {
    id: "1",
    name: "Administrator",
    description: "Full system access and control",
    userCount: 2,
    icon: <ShieldAlert className="h-4 w-4" />,
  },
  {
    id: "2",
    name: "Manager",
    description: "Can manage most settings and users",
    userCount: 3,
    icon: <Settings className="h-4 w-4" />,
  },
  {
    id: "3",
    name: "Technician",
    description: "Access to maintenance functions",
    userCount: 5,
    icon: <Tool className="h-4 w-4" />,
  },
  {
    id: "4",
    name: "Viewer",
    description: "Read-only access to dashboards",
    userCount: 8,
    icon: <Eye className="h-4 w-4" />,
  },
]

export default function UserRoles() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-500" />
            <CardTitle className="text-xl">User Roles</CardTitle>
          </div>
          <Button variant="outline" size="sm" className="h-8">
            <Plus className="h-4 w-4 mr-2" />
            New Role
          </Button>
        </div>
        <CardDescription>System access roles and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {roles.map((role) => (
            <div key={role.id} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-3">{role.icon}</div>
                <div>
                  <div className="font-medium">{role.name}</div>
                  <div className="text-xs text-muted-foreground">{role.description}</div>
                </div>
              </div>
              <Badge variant="outline">{role.userCount} users</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
