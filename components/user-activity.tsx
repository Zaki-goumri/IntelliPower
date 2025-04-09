"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, UserCheck, LogIn, Settings, Shield } from "lucide-react"

type ActivityEvent = {
  id: string
  user: string
  action: string
  time: string
  icon: React.ReactNode
}

const activityEvents: ActivityEvent[] = [
  {
    id: "1",
    user: "John Smith",
    action: "Logged in",
    time: "Just now",
    icon: <LogIn className="h-4 w-4" />,
  },
  {
    id: "2",
    user: "Sarah Johnson",
    action: "Modified temperature settings",
    time: "5 minutes ago",
    icon: <Settings className="h-4 w-4" />,
  },
  {
    id: "3",
    user: "Michael Chen",
    action: "Acknowledged alert",
    time: "1 hour ago",
    icon: <Shield className="h-4 w-4" />,
  },
  {
    id: "4",
    user: "Admin",
    action: "Added new user",
    time: "3 hours ago",
    icon: <UserCheck className="h-4 w-4" />,
  },
]

export default function UserActivity() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Activity className="h-5 w-5 mr-2 text-green-500" />
          <CardTitle className="text-xl">Recent Activity</CardTitle>
        </div>
        <CardDescription>User activity log</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityEvents.map((event) => (
            <div key={event.id} className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-3">{event.icon}</div>
              <div>
                <div className="font-medium">{event.user}</div>
                <div className="text-sm">{event.action}</div>
                <div className="text-xs text-muted-foreground">{event.time}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
