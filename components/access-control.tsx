"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus, UserCheck, UserX } from "lucide-react"

type AccessEvent = {
  id: number
  name: string
  avatar: string
  location: string
  time: string
  status: "granted" | "denied"
}

const recentAccess: AccessEvent[] = [
  {
    id: 1,
    name: "John Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "Main Entrance",
    time: "15:30:22",
    status: "granted",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "Server Room 2",
    time: "15:15:07",
    status: "granted",
  },
  {
    id: 3,
    name: "Unknown ID",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "Server Room 1",
    time: "14:52:33",
    status: "denied",
  },
  {
    id: 4,
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "Server Room 2",
    time: "14:30:18",
    status: "granted",
  },
]

export default function AccessControl() {
  const [accessEvents, setAccessEvents] = useState<AccessEvent[]>(recentAccess)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Access Control</CardTitle>
        <CardDescription>Recent access events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accessEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={event.avatar} alt={event.name} />
                  <AvatarFallback>
                    {event.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">{event.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {event.location} • {event.time}
                  </div>
                </div>
              </div>
              <Badge variant={event.status === "granted" ? "outline" : "destructive"} className="text-xs">
                {event.status === "granted" ? (
                  <UserCheck className="h-3 w-3 mr-1" />
                ) : (
                  <UserX className="h-3 w-3 mr-1" />
                )}
                {event.status.toUpperCase()}
              </Badge>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full flex items-center justify-center">
            <UserPlus className="h-4 w-4 mr-2" />
            Manage Access Permissions
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
