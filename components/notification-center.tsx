"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Thermometer, Shield, Power, Check, Clock } from "lucide-react"

type Notification = {
  id: string
  type: "temperature" | "security" | "power" | "system"
  title: string
  message: string
  time: string
  read: boolean
  severity: "low" | "medium" | "high"
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "temperature",
    title: "Temperature Alert",
    message: "Server Room 1 temperature above threshold (29.5°C)",
    time: "15 minutes ago",
    read: false,
    severity: "high",
  },
  {
    id: "2",
    type: "security",
    title: "Security Alert",
    message: "Failed login attempt from unknown IP address",
    time: "1 hour ago",
    read: false,
    severity: "medium",
  },
  {
    id: "3",
    type: "power",
    title: "Power Consumption",
    message: "Unusual power consumption pattern detected",
    time: "3 hours ago",
    read: true,
    severity: "medium",
  },
  {
    id: "4",
    type: "system",
    title: "System Update",
    message: "New system update available (v2.3.4)",
    time: "1 day ago",
    read: true,
    severity: "low",
  },
  {
    id: "5",
    type: "temperature",
    title: "Temperature Normalized",
    message: "Server Room 2 temperature returned to normal range",
    time: "2 days ago",
    read: true,
    severity: "low",
  },
]

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [activeTab, setActiveTab] = useState("all")

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "temperature":
        return <Thermometer className="h-5 w-5" />
      case "security":
        return <Shield className="h-5 w-5" />
      case "power":
        return <Power className="h-5 w-5" />
      case "system":
        return <Bell className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-amber-500"
      case "low":
        return "text-green-500"
      default:
        return "text-blue-500"
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    return notification.type === activeTab
  })

  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-blue-500" />
            <CardTitle className="text-xl">Notification Center</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} New
              </Badge>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
            <Button variant="outline" size="sm" onClick={clearAll}>
              Clear All
            </Button>
          </div>
        </div>
        <CardDescription>System notifications and alerts</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="power">Power</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border rounded-md ${!notification.read ? "bg-muted" : ""}`}
                  >
                    <div className="flex items-start">
                      <div className={`mt-0.5 mr-3 ${getSeverityColor(notification.severity)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{notification.title}</div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                          </div>
                        </div>
                        <div className="mt-1">{notification.message}</div>
                        {!notification.read && (
                          <div className="mt-2 flex justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as Read
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No notifications</h3>
                <p className="text-muted-foreground">
                  You don't have any {activeTab !== "all" ? activeTab : ""} notifications at this time
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
